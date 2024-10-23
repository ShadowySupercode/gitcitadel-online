import { b as get_store_value, c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { nip19 } from "nostr-tools";
import { C as Container } from "../../../../chunks/Container.js";
import { R as ReposSummaryList } from "../../../../chunks/ReposSummaryList.js";
import { U as UserHeader } from "../../../../chunks/UserHeader.js";
import { w as writable } from "../../../../chunks/index2.js";
import { n as ndk, a as repo_kind, b as base_relays, d as eventToRepoEvent, f as ensureRepoCollection, g as extractAReference, h as repoCollectionToSummary, s as summary_defaults } from "../../../../chunks/type.js";
import { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { A as AlertError } from "../../../../chunks/AlertError.js";
const selected_npub_repo_collections = writable({
  pubkey: "",
  collections: []
});
const unsubscribers = [];
const ensureSelectedPubkeyRepoCollection = (pubkey) => {
  const collections = get_store_value(selected_npub_repo_collections);
  if (collections.pubkey === pubkey) return selected_npub_repo_collections;
  selected_npub_repo_collections.set({
    pubkey,
    collections: []
  });
  const sub = ndk.subscribe(
    { kinds: [repo_kind], authors: [pubkey] },
    { closeOnEose: true },
    NDKRelaySet.fromRelayUrls(base_relays, ndk)
  );
  const identifiers = [];
  sub.on("event", (event) => {
    const repo_event = eventToRepoEvent(event);
    if (repo_event && repo_event.author === pubkey && !identifiers.includes(repo_event.identifier))
      identifiers.push(repo_event.identifier);
  });
  sub.on("eose", () => {
    identifiers.forEach((identifier) => {
      unsubscribers.push(
        ensureRepoCollection(`${repo_kind}:${pubkey}:${identifier}`).subscribe(
          (c) => {
            if (!c.maintainers.includes(pubkey)) return;
            selected_npub_repo_collections.update((selected_collections) => {
              if (selected_collections.pubkey !== pubkey)
                return { ...selected_collections };
              let collection_in_selected_collections = false;
              const collections2 = selected_collections.collections.map(
                (old_c) => {
                  const ref = extractAReference(old_c.selected_a);
                  if (ref && ref.identifier === identifier) {
                    collection_in_selected_collections = true;
                    return {
                      ...c
                    };
                  }
                  return { ...old_c };
                }
              );
              if (!collection_in_selected_collections) collections2.push(c);
              return {
                ...selected_collections,
                collections: collections2
              };
            });
          }
        )
      );
    });
  });
  return selected_npub_repo_collections;
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_npub_repo_collections, $$unsubscribe_selected_npub_repo_collections;
  $$unsubscribe_selected_npub_repo_collections = subscribe(selected_npub_repo_collections, (value) => $selected_npub_repo_collections = value);
  let { data } = $$props;
  let error = false;
  let pubkey;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      try {
        let decoded = nip19.decode(data.npub);
        if (decoded.type === "npub") pubkey = decoded.data;
        else if (decoded.type === "nprofile") pubkey = decoded.data.pubkey;
        else error = true;
        if (pubkey) ensureSelectedPubkeyRepoCollection(pubkey);
      } catch {
        error = true;
      }
    }
  }
  $$unsubscribe_selected_npub_repo_collections();
  return `${$$result.head += `<!-- HEAD_svelte-1abe63g_START -->${$$result.title = `<title>GitWorkshop</title>`, ""}<!-- HEAD_svelte-1abe63g_END -->`, ""} ${error ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
        default: () => {
          return `<div data-svelte-h="svelte-1p2v446">Error! profile reference in URL is not a valid npub or nprofile::</div> <div class="break-all">${escape(data.npub)}</div>`;
        }
      })}`;
    }
  })}` : `${pubkey ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="mt-12">${validate_component(UserHeader, "UserHeader").$$render(
        $$result,
        {
          user: pubkey,
          link_to_profile: false,
          size: "full"
        },
        {},
        {}
      )} <div class="divider"></div> ${validate_component(ReposSummaryList, "ReposSummaryList").$$render(
        $$result,
        {
          title: "Repositories",
          repos: $selected_npub_repo_collections.collections.map((c) => repoCollectionToSummary(c) || { ...summary_defaults }),
          loading: false
        },
        {},
        {}
      )}</div>`;
    }
  })}` : ``}`}`;
});
export {
  Page as default
};
