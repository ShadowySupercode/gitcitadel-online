import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { C as Container } from "../../../chunks/Container.js";
import { R as ReposSummaryList } from "../../../chunks/ReposSummaryList.js";
import { n as ndk, a as repo_kind, b as base_relays, d as eventToRepoEvent, e as ensureRepo, r as repoEventToSummary, s as summary_defaults } from "../../../chunks/type.js";
import { w as writable } from "../../../chunks/index2.js";
import { NDKRelaySet } from "@nostr-dev-kit/ndk";
const recent_repos = writable({
  events: [],
  loading: true
});
let started = false;
const ensureRecentRepos = () => {
  if (started) return recent_repos;
  started = true;
  const sub = ndk.subscribe(
    { kinds: [repo_kind] },
    { closeOnEose: true },
    NDKRelaySet.fromRelayUrls(base_relays, ndk)
  );
  sub.on("event", (event) => {
    const repo_event = eventToRepoEvent(event);
    if (repo_event) {
      ensureRepo(event).subscribe((repo_event2) => {
        recent_repos.update((collection) => {
          let events = collection.events;
          let exists = false;
          events.map((e) => {
            if (e.author === repo_event2.author && e.identifier === repo_event2.identifier) {
              exists = true;
              return repo_event2;
            } else return e;
          });
          if (!exists) events = [...events, repo_event2];
          return {
            ...collection,
            events
          };
        });
      });
    }
  });
  sub.on("eose", () => {
    recent_repos.update((collection) => ({
      ...collection,
      loading: false
    }));
  });
  return recent_repos;
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $recent_repos, $$unsubscribe_recent_repos;
  $$unsubscribe_recent_repos = subscribe(recent_repos, (value) => $recent_repos = value);
  ensureRecentRepos();
  $$unsubscribe_recent_repos();
  return `${$$result.head += `<!-- HEAD_svelte-1cxkxaq_START -->${$$result.title = `<title>GitWorkshop - Repos</title>`, ""}<!-- HEAD_svelte-1cxkxaq_END -->`, ""} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="mt-3">${validate_component(ReposSummaryList, "ReposSummaryList").$$render(
        $$result,
        {
          title: "Explore Repositories",
          repos: $recent_repos.events.map((c) => repoEventToSummary(c) || { ...summary_defaults }),
          group_by: "name",
          loading: $recent_repos.loading
        },
        {},
        {}
      )}</div>`;
    }
  })}`;
});
export {
  Page as default
};
