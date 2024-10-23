import {
  NDKRelaySet,
  type NDKEvent,
  NDKSubscription,
  type NDKFilter,
} from '@nostr-dev-kit/ndk'
import { writable, type Writable } from 'svelte/store'
import { base_relays, ndk } from './ndk'
import { awaitSelectedRepoCollection } from './repo'
import {
  issue_kind,
  proposal_status_kinds,
  proposal_status_open,
  repo_kind,
} from '$lib/kinds'
import {
  extractIssueDescription,
  extractIssueTitle,
} from '$lib/components/events/content/utils'
import { selectRepoFromCollection } from '$lib/components/repo/utils'
import {
  summary_defaults,
  type IssueSummaries,
} from '$lib/components/issues/type'

export const issue_summaries: Writable<IssueSummaries> = writable({
  repo_a: '',
  summaries: [],
  loading: false,
})

let selected_repo_a: string | undefined = ''

let sub: NDKSubscription

export const ensureIssueSummaries = async (repo_a: string | undefined) => {
  if (selected_repo_a == repo_a) return
  issue_summaries.set({
    repo_a,
    summaries: [],
    loading: repo_a !== '',
  })

  if (sub) sub.stop()
  if (sub_statuses) sub_statuses.stop()

  selected_repo_a = repo_a

  setTimeout(() => {
    issue_summaries.update((summaries) => {
      return {
        ...summaries,
        loading: false,
      }
    })
  }, 6000)

  let relays_to_use = [...base_relays]
  let filter: NDKFilter = {
    kinds: [issue_kind],
    limit: 100,
  }

  if (repo_a) {
    const repo_collection = await awaitSelectedRepoCollection(repo_a)

    const repo = selectRepoFromCollection(repo_collection)
    if (!repo) {
      // TODO: display error info bar
      return
    }

    relays_to_use =
      repo.relays.length > 3
        ? repo.relays
        : [...base_relays].concat(repo.relays)

    filter = {
      kinds: [issue_kind],
      '#a': repo.maintainers.map((m) => `${repo_kind}:${m}:${repo.identifier}`),
      limit: 100,
    }
  }

  sub = ndk.subscribe(
    filter,
    {
      closeOnEose: false,
    },
    NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
  )

  sub.on('event', (event: NDKEvent) => {
    try {
      if (event.kind == issue_kind) {
        if (!extractRepoIdentiferFromIssueEvent(event) && !repo_a) {
          // link to issue will not work as it requires an identifier
          return
        }
        issue_summaries.update((issues) => {
          return {
            ...issues,
            summaries: [
              ...issues.summaries,
              {
                ...summary_defaults,
                id: event.id,
                repo_a:
                  extractRepoIdentiferFromIssueEvent(event) || repo_a || '',
                title: extractIssueTitle(event),
                descritpion: extractIssueDescription(event.content),
                created_at: event.created_at,
                comments: 0,
                author: event.pubkey,
                loading: false,
              },
            ],
          }
        })
      }
    } catch {}
  })
  sub.on('eose', () => {
    issue_summaries.update((issues) => {
      getAndUpdateIssueStatus(issues, relays_to_use)
      return {
        ...issues,
        loading: false,
      }
    })
  })
}

let sub_statuses: NDKSubscription

function getAndUpdateIssueStatus(
  issues: IssueSummaries,
  relays: string[]
): void {
  if (sub_statuses) sub_statuses.stop()
  sub_statuses = ndk.subscribe(
    {
      kinds: proposal_status_kinds,
      '#e': issues.summaries.map((issue) => issue.id),
    },
    {
      closeOnEose: false,
    },
    NDKRelaySet.fromRelayUrls(relays, ndk)
  )
  sub_statuses.on('event', (event: NDKEvent) => {
    const tagged_issue_event = event.tagValue('e')
    if (
      event.kind &&
      proposal_status_kinds.includes(event.kind) &&
      tagged_issue_event &&
      event.created_at
    ) {
      issue_summaries.update((issues) => {
        return {
          ...issues,
          summaries: issues.summaries.map((o) => {
            if (
              o.id === tagged_issue_event &&
              event.created_at &&
              o.status_date < event.created_at
            ) {
              return {
                ...o,
                status: event.kind as number,
                status_date: event.created_at,
              }
            }

            return o
          }),
        }
      })
    }
  })

  sub_statuses.on('eose', () => {
    issue_summaries.update((issues) => {
      return {
        ...issues,
        summaries: issues.summaries.map((o) => ({
          ...o,
          status: o.status || proposal_status_open,
        })),
      }
    })
  })
}

export const extractRepoIdentiferFromIssueEvent = (
  event: NDKEvent
): string | undefined => {
  const value = event.tagValue('a')
  if (!value) return undefined
  const split = value.split(':')
  if (split.length < 3) return undefined
  return value
}
