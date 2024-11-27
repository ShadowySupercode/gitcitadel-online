<script lang="ts">
  import Container from '$lib/components/Container.svelte'
  import InstallNgit from '$lib/components/InstallNgit.svelte'
  import ReposSummaryList from '$lib/components/ReposSummaryList.svelte'
  import ProposalsList from '$lib/components/proposals/ProposalsList.svelte'
  import {
    summary_defaults,
    type RepoEvent,
    type RepoSummary,
  } from '$lib/components/repo/type'
  import { repo_kind } from '$lib/kinds'
  import {
    ensureProposalSummaries,
    proposal_summaries,
  } from '$lib/stores/Proposals'
  import { ensureRepo, repoEventToSummary } from '$lib/stores/repos'
  import { writable, type Writable } from 'svelte/store'

  ensureProposalSummaries(undefined)

  let example_repos: Writable<RepoSummary[]> = writable([])
  const updateRepos = (r: RepoEvent) => {
    example_repos.update((repos) => {
      return [
        ...repos.filter(
          (s) => s.identifier.length > 0 && s.identifier !== r.identifier
        ),
        repoEventToSummary(r) || {
          ...summary_defaults,
        },
      ].sort()
    })
  }
  ensureRepo(
    `${repo_kind}:fd208ee8c8f283780a9552896e4823cc9dc6bfd442063889577106940fd927c1:gitcitadel`
  ).subscribe(updateRepos)
  ensureRepo(
    `${repo_kind}:fd208ee8c8f283780a9552896e4823cc9dc6bfd442063889577106940fd927c1:Alexandria`
  ).subscribe(updateRepos)
  ensureRepo(
    `${repo_kind}:fd208ee8c8f283780a9552896e4823cc9dc6bfd442063889577106940fd927c1:eBookUtility`
  ).subscribe(updateRepos)
  ensureRepo(
    `${repo_kind}:70122128273bdc07af9be7725fa5c4bc0fc146866bec38d44360dc4bc6cc18b9:aedile-ndk`
  ).subscribe(updateRepos)
</script>

<svelte:head>
  <title>GitCitadel</title>
</svelte:head>

<Container>
  <div>
    <div class="m-auto mt-5 max-w-lg text-center">
      <div class="prose">
        <h1 class="mb-2">
          <span class="text-purple-600">GitCitadel</span>
        </h1>
        <p class="mb-8 mt-3">
          Because we think about git every day.
        </p>
      </div>
    </div>
  </div>
</Container>

<Container>
  <div class="m-auto max-w-5xl">
    <div class="grid gap-4 md:grid-cols-6">
      <div class=""></div>
      <div class="card col-span-2 bg-base-300">
        <div class="card-body">
          <div class="card-title">
            <h3>Alexandria</h3>
          </div>
          <div class="prose">
            The Nostr <a href="https://alexandria.gitcitadel.eu/">Alexandria</a> e-reader and publisher, for <a href="https://github.com/nostr-protocol/nips/pull/1600">NIP-62 Curated Publications</a> has not yet been released, but you can try it out in our <a href="https://next-alexandria.gitcitadel.eu/">dev environment</a>.
          </div>
        </div>
      </div>
      <div class="card col-span-2 bg-base-300">
        <div class="card-body">
          <div class="card-title">
            <h3>
              GitCitadel Status
            </h3>
          </div>
          <div class="prose">
            <a href="https://status.gitcitadel.com/">monitoring page</a> for various relays and servers
          </div>
        </div>
        </div>
        <div class="card col-span-2 bg-base-300">
        <div class="card-body">
          <div class="card-title">
            <h3>
              About GitCitadel
            </h3>
          </div>
          <div class="prose">
            You can find out more about our project, on our wiki pages: <a href="https://wikistr.com/gitcitadel-project*dd664d5e4016433a8cd69f005ae1480804351789b59de5af06276de65633d319">project docs</a>
        </div>
      </div>
    </div>
      <div class="card col-span-2 bg-base-300">
        <div class="card-body">
          <div class="card-title">
            <h3>Noscrypt</h3>
          </div>
          <div class="prose">
            One of the C-libraries that the Aedile NDK uses is <a href="https://www.vaughnnugent.com/resources/software/modules/noscrypt">Noscrypt</a>, which handles the cryptography operations.
          </div>
        </div>
      </div>
</Container>

<Container>
  <div class="prose m-auto mb-6 mt-6">
    <h2>GitCitadel Repositories</h2>
    <p>These are the repositories we're working on, currently.</p>
    <div class="not-prose lg:w-[64rem]">
      <ReposSummaryList repos={$example_repos} loading={false} />
    </div>
  </div>
</Container>
