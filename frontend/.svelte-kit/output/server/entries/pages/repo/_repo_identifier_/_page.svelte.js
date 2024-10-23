import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../../../chunks/ssr.js";
import { C as Container } from "../../../../chunks/Container.js";
import { R as ReposSummaryList } from "../../../../chunks/ReposSummaryList.js";
import { w as writable } from "../../../../chunks/index2.js";
import { n as ndk, a as repo_kind, b as base_relays, d as eventToRepoEvent, e as ensureRepo, r as repoEventToSummary } from "../../../../chunks/type.js";
import { NDKRelaySet } from "@nostr-dev-kit/ndk";
const repos_identifer = {};
const ensureIdentifierRepoCollection = (identifier) => {
  if (!Object.keys(repos_identifer).includes(identifier)) {
    repos_identifer[identifier] = writable({
      d: "",
      events: [],
      loading: true
    });
    const sub = ndk.subscribe(
      { kinds: [repo_kind], "#d": [identifier] },
      { closeOnEose: true },
      NDKRelaySet.fromRelayUrls(base_relays, ndk)
    );
    sub.on("event", (event) => {
      const repo_event = eventToRepoEvent(event);
      if (repo_event && repo_event.identifier === identifier) {
        ensureRepo(event).subscribe((repo_event2) => {
          repos_identifer[identifier].update((collection) => {
            let events = collection.events;
            let exists = false;
            events.map((e) => {
              if (e.author === repo_event2.author) {
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
      repos_identifer[identifier].update((collection) => ({
        ...collection,
        loading: false
      }));
    });
  }
  return repos_identifer[identifier];
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $collection, $$unsubscribe_collection;
  let { data } = $$props;
  let collection = ensureIdentifierRepoCollection(data.repo_identifier || "");
  $$unsubscribe_collection = subscribe(collection, (value) => $collection = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_collection();
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="m-5">${validate_component(ReposSummaryList, "ReposSummaryList").$$render(
        $$result,
        {
          title: `repositories for '${data.repo_identifier}'`,
          repos: $collection.events.map(repoEventToSummary),
          loading: $collection.loading
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
