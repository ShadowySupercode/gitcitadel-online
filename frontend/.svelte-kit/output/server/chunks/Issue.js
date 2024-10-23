import { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { w as writable } from "./index2.js";
import { D as full_defaults, E as awaitSelectedRepoCollection, F as selectRepoFromCollection, b as base_relays, n as ndk, l as proposal_status_open, G as extractPatchMessage, H as proposal_status_kinds, I as extractIssueTitle, J as extractIssueDescription } from "./type.js";
import { f as full_defaults$1 } from "./type2.js";
const ignore_kinds = [
  31234,
  // amethyst draft kind
  9978
  // confidence scoring event
];
const selected_proposal_full = writable({
  ...full_defaults
});
let selected_proposal_id = "";
const selected_proposal_replies = writable([]);
let selected_proposal_status_date = 0;
let sub$1;
let sub_replies$1;
const sub_replies_to_replies$1 = [];
const ensureProposalFull = (repo_a, proposal_id_or_event) => {
  const proposal_id = typeof proposal_id_or_event === "string" ? proposal_id_or_event : proposal_id_or_event.id;
  if (selected_proposal_id == proposal_id) return;
  if (proposal_id == "") {
    selected_proposal_full.set({ ...full_defaults });
    selected_proposal_replies.set([]);
    return;
  }
  if (sub$1) sub$1.stop();
  if (sub_replies$1) sub_replies$1.stop();
  sub_replies_to_replies$1.forEach((sub2) => sub2.stop());
  selected_proposal_id = proposal_id;
  selected_proposal_status_date = 0;
  selected_proposal_replies.set([]);
  selected_proposal_full.set({
    ...full_defaults,
    summary: {
      ...full_defaults.summary,
      id: proposal_id,
      repo_a,
      loading: true
    },
    loading: true
  });
  new Promise(async (r) => {
    const repo_collection = await awaitSelectedRepoCollection(repo_a);
    const repo = selectRepoFromCollection(repo_collection);
    const relays_to_use = repo && repo.relays.length > 3 ? repo.relays : [...base_relays].concat(repo ? repo.relays : []);
    const setEvent = (event) => {
      try {
        selected_proposal_full.update((full) => {
          return {
            ...full,
            proposal_event: event,
            summary: {
              ...full.summary,
              title: (event.tagValue("name") || event.tagValue("description") || extractPatchMessage(event.content) || "").split("\n")[0],
              descritpion: event.tagValue("description") || "",
              created_at: event.created_at,
              comments: 0,
              author: event.pubkey,
              loading: false
            }
          };
        });
      } catch {
      }
    };
    if (typeof proposal_id_or_event !== "string") {
      setEvent(proposal_id_or_event);
    } else {
      sub$1 = ndk.subscribe(
        {
          ids: [proposal_id],
          limit: 100
        },
        {
          closeOnEose: false
        },
        NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
      );
      sub$1.on("event", (event) => {
        if (event.id == proposal_id) setEvent(event);
      });
      sub$1.on("eose", () => {
        selected_proposal_full.update((full) => {
          const updated = {
            ...full,
            summary: {
              ...full.summary,
              loading: false
            }
          };
          if (full.loading === false) {
            r({ ...updated });
          }
          return updated;
        });
      });
    }
    sub_replies$1 = ndk.subscribe(
      {
        "#e": [proposal_id]
      },
      {
        closeOnEose: false
      },
      NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
    );
    const process_replies = (event) => {
      if (event.kind && ignore_kinds.includes(event.kind)) return false;
      if (event.kind && proposal_status_kinds.includes(event.kind) && event.created_at && selected_proposal_status_date < event.created_at) {
        selected_proposal_status_date = event.created_at;
        selected_proposal_full.update((full) => {
          return {
            ...full,
            summary: {
              ...full.summary,
              status: event.kind,
              // this wont be 0 as we are ensuring it is not undefined above
              status_date: event.created_at || 0
            }
          };
        });
      }
      selected_proposal_replies.update((replies) => {
        if (!replies.some((e) => e.id === event.id)) {
          const sub_replies_to_reply = ndk.subscribe(
            {
              "#e": [event.id]
            },
            {
              groupable: true,
              groupableDelay: 300,
              closeOnEose: false
            },
            NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
          );
          sub_replies_to_reply.on("event", (event2) => {
            process_replies(event2);
          });
          sub_replies_to_replies$1.push(sub_replies_to_reply);
          return [...replies, event];
        }
        return [...replies];
      });
    };
    sub_replies$1.on("event", (event) => {
      process_replies(event);
    });
    sub_replies$1.on("eose", () => {
      selected_proposal_full.update((full) => {
        const updated = {
          ...full,
          summary: {
            ...full.summary,
            status: full.summary.status || proposal_status_open
          },
          loading: false
        };
        if (full.summary.loading === false) {
          r({ ...updated });
        }
        return updated;
      });
    });
  });
};
const selected_issue_full = writable({
  ...full_defaults$1
});
let selected_issue_id = "";
const selected_issue_replies = writable([]);
let selected_issue_status_date = 0;
let sub;
let sub_replies;
const sub_replies_to_replies = [];
const ensureIssueFull = (repo_a, issue_id_or_event) => {
  const issue_id = typeof issue_id_or_event === "string" ? issue_id_or_event : issue_id_or_event.id;
  if (selected_issue_id == issue_id) return;
  if (issue_id == "") {
    selected_issue_full.set({ ...full_defaults$1 });
    selected_issue_replies.set([]);
    return;
  }
  if (sub) sub.stop();
  if (sub_replies) sub_replies.stop();
  sub_replies_to_replies.forEach((sub2) => sub2.stop());
  selected_issue_id = issue_id;
  selected_issue_status_date = 0;
  selected_issue_replies.set([]);
  selected_issue_full.set({
    ...full_defaults$1,
    summary: {
      ...full_defaults$1.summary,
      id: issue_id,
      repo_a,
      loading: true
    },
    loading: true
  });
  new Promise(async (r) => {
    const repo_collection = await awaitSelectedRepoCollection(repo_a);
    const repo = selectRepoFromCollection(repo_collection);
    const relays_to_use = repo && repo.relays.length > 3 ? repo.relays : [...base_relays].concat(repo ? repo.relays : []);
    const setEvent = (event) => {
      try {
        selected_issue_full.update((full) => {
          return {
            ...full,
            issue_event: event,
            summary: {
              ...full.summary,
              title: extractIssueTitle(event),
              descritpion: extractIssueDescription(event.content),
              created_at: event.created_at,
              comments: 0,
              author: event.pubkey,
              loading: false
            }
          };
        });
      } catch {
      }
    };
    if (typeof issue_id_or_event !== "string") {
      setEvent(issue_id_or_event);
    } else {
      sub = ndk.subscribe(
        {
          ids: [issue_id],
          limit: 100
        },
        {
          closeOnEose: false
        },
        NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
      );
      sub.on("event", (event) => {
        if (event.id == issue_id) setEvent(event);
      });
      sub.on("eose", () => {
        selected_issue_full.update((full) => {
          const updated = {
            ...full,
            summary: {
              ...full.summary,
              loading: false
            }
          };
          if (full.loading === false) {
            r({ ...updated });
          }
          return updated;
        });
      });
    }
    sub_replies = ndk.subscribe(
      {
        "#e": [issue_id]
      },
      {
        closeOnEose: false
      },
      NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
    );
    const process_replies = (event) => {
      if (event.kind && ignore_kinds.includes(event.kind)) return false;
      if (event.kind && proposal_status_kinds.includes(event.kind) && event.created_at && selected_issue_status_date < event.created_at) {
        selected_issue_status_date = event.created_at;
        selected_issue_full.update((full) => {
          return {
            ...full,
            summary: {
              ...full.summary,
              status: event.kind,
              // this wont be 0 as we are ensuring it is not undefined above
              status_date: event.created_at || 0
            }
          };
        });
      }
      selected_issue_replies.update((replies) => {
        if (!replies.some((e) => e.id === event.id)) {
          const sub_replies_to_reply = ndk.subscribe(
            {
              "#e": [event.id]
            },
            {
              groupable: true,
              groupableDelay: 300,
              closeOnEose: false
            },
            NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
          );
          sub_replies_to_reply.on("event", (event2) => {
            process_replies(event2);
          });
          sub_replies_to_replies.push(sub_replies_to_reply);
          return [...replies, event];
        }
        return [...replies];
      });
    };
    sub_replies.on("event", (event) => {
      process_replies(event);
    });
    sub_replies.on("eose", () => {
      selected_issue_full.update((full) => {
        const updated = {
          ...full,
          summary: {
            ...full.summary,
            status: full.summary.status || proposal_status_open
          },
          loading: false
        };
        if (full.summary.loading === false) {
          r({ ...updated });
        }
        return updated;
      });
    });
  });
};
export {
  ensureProposalFull as a,
  selected_issue_replies as b,
  selected_proposal_full as c,
  selected_proposal_replies as d,
  ensureIssueFull as e,
  selected_issue_full as s
};
