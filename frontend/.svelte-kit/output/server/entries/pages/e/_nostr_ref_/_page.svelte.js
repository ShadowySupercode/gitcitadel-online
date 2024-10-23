import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { nip19 } from "nostr-tools";
import { C as Container } from "../../../../chunks/Container.js";
import { g as goto } from "../../../../chunks/client.js";
import { a as repo_kind, p as patch_kind, i as issue_kind, n as ndk, b as base_relays, c as aToNaddr } from "../../../../chunks/type.js";
import { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { e as ensureIssueFull, a as ensureProposalFull } from "../../../../chunks/Issue.js";
import { A as AlertError } from "../../../../chunks/AlertError.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let error = false;
  let error_msg = "reference in URL is not a repository, proposal, issue or npub reference";
  let waited = false;
  const showError = (msg) => {
    if (msg) error_msg = msg;
    error = true;
    waited = true;
  };
  let lookupEvent = (id, relays = void 0) => {
    let sub = ndk.subscribe({ ids: [id], limit: 100 }, { closeOnEose: false }, NDKRelaySet.fromRelayUrls([...base_relays, ...relays || []], ndk));
    sub.on("event", (event) => {
      try {
        if (event.id == id) {
          let a = event.tagValue("a");
          if (!a) {
            showError('found event but it contains an invalid "a" tag reference');
          } else {
            if (event.kind === issue_kind) {
              ensureIssueFull(a, event);
              goto(`/r/${aToNaddr(a)}/issues/${nip19.noteEncode(id)}`);
            } else if (event.kind === patch_kind) {
              ensureProposalFull(a, event);
              goto(`/r/${aToNaddr(a)}/proposals/${nip19.noteEncode(id)}`);
            } else {
              showError();
            }
          }
        }
      } catch {
      }
    });
    sub.on("eose", () => {
      showError("cannot find event");
    });
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      try {
        let decoded = nip19.decode(data.nostr_ref);
        if (decoded.type === "npub" || decoded.type === "nprofile") goto(`/p/${data.nostr_ref}`);
        else if (decoded.type === "naddr" && decoded.data.kind === repo_kind) {
          goto(`/r/${data.nostr_ref}`);
        } else if (decoded.type === "nrelay" || decoded.type === "nsec") {
          showError();
        } else if (typeof decoded.data === "string") {
          lookupEvent(decoded.data);
        } else if ((decoded.type === "nevent" || decoded.type === "note") && // doesnt have a confirmed kind of something other than issue or patch
        !(decoded.data.kind && [patch_kind, issue_kind].includes(decoded.data.kind))) {
          lookupEvent(decoded.data.id, decoded.data.relays);
        } else {
          showError();
        }
      } catch {
        try {
          nip19.noteEncode(data.nostr_ref);
          lookupEvent(data.nostr_ref);
        } catch {
          showError();
        }
      }
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-bs2zwp_START -->${$$result.title = `<title>GitWorkshop - ngit</title>`, ""}<!-- HEAD_svelte-bs2zwp_END -->`, ""} ${error && waited ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
        default: () => {
          return `<div>Error! ${escape(error_msg)}:</div> <div class="break-all">${escape(data.nostr_ref)}</div>`;
        }
      })}`;
    }
  })}` : `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `loading...`;
    }
  })}`}`;
});
export {
  Page as default
};
