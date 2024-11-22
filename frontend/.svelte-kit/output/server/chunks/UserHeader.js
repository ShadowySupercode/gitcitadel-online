import { b as get_store_value, c as create_ssr_component, e as escape, f as each, h as add_attribute, a as subscribe, v as validate_component, o as onDestroy, k as add_classes } from "./ssr.js";
import { n as ndk, A as defaults, l as proposal_status_open, m as proposal_status_applied, x as proposal_status_draft, o as proposal_status_closed, q as statusKindtoText, b as base_relays, p as patch_kind, z as summary_defaults, G as extractPatchMessage, L as returnRepoCollection, H as proposal_status_kinds, E as awaitSelectedRepoCollection, F as selectRepoFromCollection, a as repo_kind, M as extractTagContent, g as extractAReference, d as eventToRepoEvent, I as extractIssueTitle, i as issue_kind, N as isCoverLetter, e as ensureRepo, O as parseContent, P as isParsedNewLine, Q as isParsedLink, R as isImage, S as isParsedNpub, T as isParsedNprofile, U as isParsedNevent, V as isParsedNote, W as isParsedNaddr, X as isParsedText, C as getName } from "./type.js";
import { NDKNip07Signer, getRelayListForUser, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { w as writable } from "./index2.js";
import "./client.js";
import dayjs from "dayjs";
import parseDiff from "parse-diff";
import hljs from "highlight.js/lib/common";
import { nip19 } from "nostr-tools";
const users = {};
const empty_user = writable({
  loading: true,
  hexpubkey: "",
  npub: "npub..."
});
const ensureUser = (hexpubkey) => {
  if (hexpubkey === "") return empty_user;
  if (!users[hexpubkey]) {
    const u = ndk.getUser({ hexpubkey });
    const base = {
      loading: false,
      hexpubkey,
      npub: u.npub
    };
    users[hexpubkey] = writable(base);
    getUserRelays(hexpubkey);
    const getProfile = () => {
      u.fetchProfile({
        closeOnEose: true,
        groupable: true,
        // default 100
        groupableDelay: 200
      }).then(
        (p) => {
          users[hexpubkey].update((u2) => ({
            ...u2,
            loading: false,
            profile: p === null ? void 0 : p
          }));
        },
        () => {
          users[hexpubkey].update((u2) => ({
            ...u2,
            loading: false
          }));
        }
      );
    };
    let attempts = 1;
    const tryAgainin3s = () => {
      setTimeout(
        () => {
          if (!get_store_value(users[hexpubkey]).profile) {
            getProfile();
            attempts++;
            if (attempts < 5) tryAgainin3s();
          }
        },
        (attempts ^ 2) * 1e3
      );
    };
    getProfile();
    tryAgainin3s();
  }
  return users[hexpubkey];
};
const nip07_plugin = writable(void 0);
const signer = new NDKNip07Signer(2e3);
const logged_in_user = writable(void 0);
const login = async () => {
  return new Promise(async (res, rej) => {
    const user = get_store_value(logged_in_user);
    if (user) return res();
    if (get_store_value(nip07_plugin)) {
      try {
        const ndk_user = await signer.blockUntilReady();
        localStorage.setItem("nip07pubkey", ndk_user.pubkey);
        logged_in_user.set({
          ...defaults,
          hexpubkey: ndk_user.pubkey
        });
        ndk.signer = signer;
        ensureUser(ndk_user.pubkey).subscribe((user2) => {
          logged_in_user.set({ ...user2 });
        });
        return res();
      } catch (e) {
        alert(e);
        rej();
      }
    } else {
      rej();
    }
  });
};
const user_relays = {};
const getUserRelays = async (hexpubkey) => {
  return new Promise(async (res, _) => {
    if (user_relays[hexpubkey]) {
      const unsubscriber = user_relays[hexpubkey].subscribe(
        (querying_user_relays) => {
          if (querying_user_relays && !querying_user_relays.loading) {
            res(querying_user_relays);
            setTimeout(() => {
              if (unsubscriber) unsubscriber();
            }, 5);
          }
        }
      );
    } else {
      user_relays[hexpubkey] = writable({
        loading: true,
        ndk_relays: void 0
      });
      const relay_list = await getRelayListForUser(hexpubkey, ndk);
      const querying_user_relays = {
        loading: false,
        ndk_relays: relay_list
      };
      user_relays[hexpubkey].set({ ...querying_user_relays });
      res(querying_user_relays);
    }
  });
};
const icons_misc = {
  chevron_down: [
    "M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1c.3-.3.8-.3 1.1 0l2.7 2.7l2.7-2.7c.3-.3.8-.3 1.1 0c.3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3"
  ],
  chevron_up: [
    "M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1c.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0c.3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4"
  ],
  // https://icon-sets.iconify.design/octicon/copy-16/
  copy: [
    "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z",
    "M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
  ],
  // https://icon-sets.iconify.design/octicon/key-16/ MIT licence
  key: [
    "M10.5 0a5.499 5.499 0 1 1-1.288 10.848l-.932.932a.75.75 0 0 1-.53.22H7v.75a.75.75 0 0 1-.22.53l-.5.5a.75.75 0 0 1-.53.22H5v.75a.75.75 0 0 1-.22.53l-.5.5a.75.75 0 0 1-.53.22h-2A1.75 1.75 0 0 1 0 14.25v-2c0-.199.079-.389.22-.53l4.932-4.932A5.5 5.5 0 0 1 10.5 0m-4 5.5c-.001.431.069.86.205 1.269a.75.75 0 0 1-.181.768L1.5 12.56v1.69c0 .138.112.25.25.25h1.69l.06-.06v-1.19a.75.75 0 0 1 .75-.75h1.19l.06-.06v-1.19a.75.75 0 0 1 .75-.75h1.19l1.023-1.025a.75.75 0 0 1 .768-.18A4 4 0 1 0 6.5 5.5M11 6a1 1 0 1 1 0-2a1 1 0 0 1 0 2"
  ],
  // https://icon-sets.iconify.design/clarity/lightning-solid/ MIT licence
  lightning: [
    "M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z"
  ],
  info: [
    "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13M6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75M8 6a1 1 0 1 1 0-2a1 1 0 0 1 0 2"
  ],
  link: [
    "m7.775 3.275l1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0a.75.75 0 0 1 .018-1.042a.75.75 0 0 1 1.042-.018a2 2 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042m-4.69 9.64a2 2 0 0 0 2.83 0l1.25-1.25a.75.75 0 0 1 1.042.018a.75.75 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0a.75.75 0 0 1-.018 1.042a.75.75 0 0 1-1.042.018a2 2 0 0 0-2.83 0l-2.5 2.5a2 2 0 0 0 0 2.83"
  ]
};
const CopyField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { label = "" } = $$props;
  let { content = "" } = $$props;
  let { border_color = "primary" } = $$props;
  let { no_border = false } = $$props;
  let { icon = void 0 } = $$props;
  let { truncate = void 0 } = $$props;
  const truncatedContent = () => {
    if (truncate && content.length > truncate[0] + truncate[1] + 3) {
      return `${content.substring(0, truncate[0])}...${content.substring(content.length - 1 - truncate[1])}`;
    }
    return content;
  };
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.content === void 0 && $$bindings.content && content !== void 0) $$bindings.content(content);
  if ($$props.border_color === void 0 && $$bindings.border_color && border_color !== void 0) $$bindings.border_color(border_color);
  if ($$props.no_border === void 0 && $$bindings.no_border && no_border !== void 0) $$bindings.no_border(no_border);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
  if ($$props.truncate === void 0 && $$bindings.truncate && truncate !== void 0) $$bindings.truncate(truncate);
  return `   <div class="${["group cursor-pointer", !no_border ? "mt-3" : ""].join(" ").trim()}">${label.length > 0 ? `${escape(label)} ${``}` : ``} <div class="${[
    "items flex w-full items-center rounded-lg border border-" + escape(border_color, true) + " opacity-50",
    (no_border && label.length === 0 ? "mt-1" : "") + " " + (!no_border ? "border" : "") + " " + (!no_border ? "p-3" : "") + " "
  ].join(" ").trim()}">${icon ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${[
    "mr-1 mt-1 inline h-4 w-4 flex-none fill-base-content opacity-50",
    ""
  ].join(" ").trim()}">${each(icon, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg>` : ``} <div class="${[
    "truncate text-sm",
    (!no_border ? "flex-auto" : "") + " " + (no_border ? "flex-none" : "")
  ].join(" ").trim()}">${escape(truncatedContent())}</div> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${[
    "ml-1 inline h-4 w-4 flex-none fill-base-content opacity-50 group-hover:opacity-100",
    " "
  ].join(" ").trim()}">${each(icons_misc.copy, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg></div></div>`;
});
const EventWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  let { type = "proposal" } = $$props;
  let { author = { ...defaults } } = $$props;
  let { created_at } = $$props;
  let { event } = $$props;
  let created_at_ago = "";
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  created_at_ago = created_at ? dayjs(created_at * 1e3).fromNow() : "";
  $$unsubscribe_logged_in_user();
  return `<div class="max-w-4xl border-b border-base-300 p-3 pl-3"><div class="flex"><div class="flex-auto">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: author, in_event_header: true }, {}, {})}</div> <span class="m-auto text-xs">${escape(created_at_ago)}</span> <div class="m-auto ml-2">${event ? `<div class="tooltip align-middle" data-tip="event json"><button class="btn btn-xs text-neutral-content" data-svelte-h="svelte-h3u2gh"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M54.8 119.49a35.06 35.06 0 0 1-5.75 8.51a35.06 35.06 0 0 1 5.75 8.51C60 147.24 60 159.83 60 172c0 25.94 1.84 32 20 32a12 12 0 0 1 0 24c-19.14 0-32.2-6.9-38.8-20.51C36 196.76 36 184.17 36 172c0-25.94-1.84-32-20-32a12 12 0 0 1 0-24c18.16 0 20-6.06 20-32c0-12.17 0-24.76 5.2-35.49C47.8 34.9 60.86 28 80 28a12 12 0 0 1 0 24c-18.16 0-20 6.06-20 32c0 12.17 0 24.76-5.2 35.49M240 116c-18.16 0-20-6.06-20-32c0-12.17 0-24.76-5.2-35.49C208.2 34.9 195.14 28 176 28a12 12 0 0 0 0 24c18.16 0 20 6.06 20 32c0 12.17 0 24.76 5.2 35.49A35.06 35.06 0 0 0 207 128a35.06 35.06 0 0 0-5.75 8.51C196 147.24 196 159.83 196 172c0 25.94-1.84 32-20 32a12 12 0 0 0 0 24c19.14 0 32.2-6.9 38.8-20.51c5.2-10.73 5.2-23.32 5.2-35.49c0-25.94 1.84-32 20-32a12 12 0 0 0 0-24"></path></svg></button></div> ${``} <div class="tooltip align-middle" data-tip="share"><button class="btn btn-xs text-neutral-content" data-svelte-h="svelte-1hkoh9e"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M176 156a43.78 43.78 0 0 0-29.09 11l-40.81-26.2a44.07 44.07 0 0 0 0-25.6L146.91 89a43.83 43.83 0 1 0-13-20.17L93.09 95a44 44 0 1 0 0 65.94l40.81 26.26A44 44 0 1 0 176 156m0-120a20 20 0 1 1-20 20a20 20 0 0 1 20-20M64 148a20 20 0 1 1 20-20a20 20 0 0 1-20 20m112 72a20 20 0 1 1 20-20a20 20 0 0 1-20 20"></path></svg></button></div> ${``}` : ``} ${$logged_in_user ? `<div class="tooltip align-middle" data-tip="reply"><button class="btn btn-xs" data-svelte-h="svelte-1665j44"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M6.78 1.97a.75.75 0 0 1 0 1.06L3.81 6h6.44A4.75 4.75 0 0 1 15 10.75v2.5a.75.75 0 0 1-1.5 0v-2.5a3.25 3.25 0 0 0-3.25-3.25H3.81l2.97 2.97a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L1.47 7.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0"></path></svg></button></div>` : ``}</div></div> <div class="ml-11">${slots.default ? slots.default({}) : ``} ${``}</div></div>`;
});
const EventWrapperLite = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { author = { ...defaults } } = $$props;
  let { created_at } = $$props;
  let created_at_ago = "";
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  created_at_ago = created_at ? dayjs(created_at * 1e3).fromNow() : "";
  return `<div class="max-w-4xl border-b border-base-300 p-3 pl-3"><div class="flex"><div class="flex-auto"><div class="inline text-neutral-400">${slots.default ? slots.default({}) : ``}</div> <div class="badge bg-base-400 text-neutral-400">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: author, inline: true }, {}, {})}</div></div> <span class="m-auto flex-none py-1 text-xs">${escape(created_at_ago)}</span></div></div>`;
});
const issue_icon_path = {
  // https://icon-sets.iconify.design/octicon/issue-opened-16/
  open: [
    "M8 9.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3",
    "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M1.5 8a6.5 6.5 0 1 0 13 0a6.5 6.5 0 0 0-13 0"
  ],
  // https://icon-sets.iconify.design/octicon/issue-closed-16/
  resolved: [
    "M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69L5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0z",
    "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1.5 0a6.5 6.5 0 1 0-13 0a6.5 6.5 0 0 0 13 0"
  ],
  //   https://icon-sets.iconify.design/octicon/no-entry-16/
  closed: [
    "M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5z",
    "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1.5 0a6.5 6.5 0 1 0-13 0a6.5 6.5 0 0 0 13 0"
  ]
};
const proposal_icon_path = {
  // http://icon-sets.iconify.design/octicon/git-pull-request-16/
  open_pull: "M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25m5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354M3.75 2.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m0 9.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m8.25.75a.75.75 0 1 0 1.5 0a.75.75 0 0 0-1.5 0",
  // https://icon-sets.iconify.design/octicon/git-pull-request-closed-16/
  open_patch: "M3.75 4.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5M3 7.75a.75.75 0 0 1 1.5 0v2.878a2.251 2.251 0 1 1-1.5 0Zm.75 5.75a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5m5-7.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m5.75 2.5a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 0 1 4.5 0m-1.5 0a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0",
  // https://icon-sets.iconify.design/octicon/git-pull-request-closed-16/
  close: "M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1m9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75m-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97l.97-.97a.748.748 0 0 1 1.265.332a.75.75 0 0 1-.205.729l-.97.97l.97.97a.751.751 0 0 1-.018 1.042a.751.751 0 0 1-1.042.018l-.97-.97l-.97.97a.749.749 0 0 1-1.275-.326a.749.749 0 0 1 .215-.734l.97-.97l-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0a.75.75 0 0 0-1.5 0M3.25 12a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m9.5 0a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5",
  // https://icon-sets.iconify.design/octicon/git-pull-request-draft-16/
  draft: "M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1m9.5 14a2.25 2.25 0 1 1 0-4.5a2.25 2.25 0 0 1 0 4.5M2.5 3.25a.75.75 0 1 0 1.5 0a.75.75 0 0 0-1.5 0M3.25 12a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m9.5 0a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5M14 7.5a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m0-4.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0",
  // https://icon-sets.iconify.design/octicon/git-merge-16/
  merge: "M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218M4.25 13.5a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5m8.5-4.5a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5M5 3.25a.75.75 0 1 0 0 .005z",
  // adapted from https://icon-sets.iconify.design/octicon/git-pull-request-closed-16/
  // TODO: centre in icon frame
  applied: "M 3.25 1 A 2.25 2.25 0 0 1 4 5.372 v 5.256 a 2.251 2.251 0 1 1 -1.5 0 V 5.372 A 2.251 2.251 0 0 1 3.25 1 Z M 2.5 3.25 a 0.75 0.75 0 1 0 1.5 0 a 0.75 0.75 0 0 0 -1.5 0 M 3.25 12 a 0.75 0.75 0 1 0 0 1.5 a 0.75 0.75 0 0 0 0 -1.5"
};
const Status = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status = void 0 } = $$props;
  let { type = "proposal" } = $$props;
  let { edit_mode = false } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.edit_mode === void 0 && $$bindings.edit_mode && edit_mode !== void 0) $$bindings.edit_mode(edit_mode);
  return `${!status ? `<div class="skeleton inline-block h-8 w-24 rounded-md align-middle"></div>` : `<div${add_attribute("tabindex", 0, 0)} role="button" class="${[
    "btn btn-success btn-sm align-middle",
    (status && status === proposal_status_open ? "btn-success" : "") + " " + (status && status === proposal_status_applied ? "btn-primary" : "") + " " + (!status || status === proposal_status_draft || status === proposal_status_closed ? "btn-neutral" : "") + " " + (!edit_mode ? "cursor-default" : "") + " " + (!edit_mode ? "no-animation" : "") + " " + (!edit_mode && status && status === proposal_status_open ? "hover:bg-success" : "") + " " + (!edit_mode && status && status === proposal_status_applied ? "hover:bg-primary" : "") + " " + (!edit_mode && status && status === proposal_status_draft || status === proposal_status_closed ? "hover:bg-neutral" : "")
  ].join(" ").trim()}">${status === proposal_status_open ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="h-5 w-5 flex-none fill-success-content pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.open_patch, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.open, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg> ${escape(statusKindtoText(proposal_status_open, type))}` : `${status === proposal_status_applied ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-primary-content pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.applied, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.resolved, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg> ${escape(statusKindtoText(proposal_status_applied, type))}` : `${status === proposal_status_closed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-neutral-content pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.close, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.closed, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg> ${escape(statusKindtoText(proposal_status_closed, type))}` : `${status === proposal_status_draft ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-neutral-content pt-1"><path${add_attribute("d", proposal_icon_path.draft, 0)}></path></svg> ${escape(statusKindtoText(proposal_status_draft, type))}` : `${escape(status)}`}`}`}`} ${edit_mode ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 flex-none fill-success-content"><path fill="currentColor" d="M11.646 15.146L5.854 9.354a.5.5 0 0 1 .353-.854h11.586a.5.5 0 0 1 .353.854l-5.793 5.792a.5.5 0 0 1-.707 0"></path></svg>` : ``}</div>`}`;
});
const Status_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "proposal" } = $$props;
  let { status } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  return `<div class="">${status ? `set status to ${validate_component(Status, "Status").$$render($$result, { type, status }, {}, {})}` : `set status incorrectly`}</div>`;
});
const proposal_summaries = writable({
  repo_a: "",
  summaries: [],
  loading: false
});
let selected_a = "";
let sub;
const ensureProposalSummaries = async (repo_a) => {
  if (selected_a == repo_a) return;
  proposal_summaries.set({
    repo_a,
    summaries: [],
    loading: repo_a !== ""
  });
  if (sub) sub.stop();
  if (sub_statuses) sub_statuses.stop();
  selected_a = repo_a;
  setTimeout(() => {
    proposal_summaries.update((summaries) => {
      return {
        ...summaries,
        loading: false
      };
    });
  }, 6e3);
  let relays_to_use = [...base_relays];
  let filter = {
    kinds: [patch_kind],
    limit: 100
  };
  if (repo_a) {
    const repo_collection = await awaitSelectedRepoCollection(repo_a);
    const repo = selectRepoFromCollection(repo_collection);
    if (!repo) {
      return;
    }
    relays_to_use = repo.relays.length > 3 ? repo.relays : [...base_relays].concat(repo.relays);
    const without_root_tag = !repo.unique_commit;
    if (without_root_tag) {
      filter = {
        kinds: [patch_kind],
        "#a": repo.maintainers.map(
          (m) => `${repo_kind}:${m}:${repo.identifier}`
        ),
        limit: 100
      };
    } else {
      filter = {
        kinds: [patch_kind],
        "#a": repo.maintainers.map(
          (m) => `${repo_kind}:${m}:${repo.identifier}`
        ),
        "#t": ["root"],
        limit: 100
      };
    }
  }
  sub = ndk.subscribe(
    filter,
    {
      closeOnEose: false
    },
    NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
  );
  sub.on("event", async (event) => {
    try {
      if (event.kind == patch_kind && event.content.length > 0 && !event.tags.some((t) => t.length > 1 && t[1] === "revision-root")) {
        if (!extractRepoAFromProposalEvent(event) && !repo_a) {
          return;
        }
        proposal_summaries.update((proposals) => {
          return {
            ...proposals,
            summaries: [
              ...proposals.summaries,
              {
                ...summary_defaults,
                id: event.id,
                repo_a: extractRepoAFromProposalEvent(event) || repo_a || "",
                title: (event.tagValue("name") || event.tagValue("description") || extractPatchMessage(event.content) || "").split("\n")[0],
                descritpion: event.tagValue("description") || "",
                created_at: event.created_at,
                comments: 0,
                author: event.pubkey,
                loading: false
              }
            ]
          };
        });
        if (repo_a && repo_a.length > 0) {
          const repo_collection = await returnRepoCollection(repo_a);
          if (selected_a === repo_a && repo_collection.events[repo_collection.most_recent_index].unique_commit) {
            proposal_summaries.update((proposals) => {
              return {
                ...proposals,
                summaries: [
                  ...proposals.summaries.filter(
                    (summary) => event.tags.some(
                      (t) => t.length > 1 && t[1] === "root"
                    ) && !event.tags.some(
                      (t) => t.length > 1 && t[1] === "revision-root"
                    ) || event.id !== summary.id
                  )
                ]
              };
            });
          }
        }
      }
    } catch {
    }
  });
  sub.on("eose", () => {
    proposal_summaries.update((proposals) => {
      getAndUpdateProposalStatus(proposals, relays_to_use);
      return {
        ...proposals,
        loading: false
      };
    });
  });
};
let sub_statuses;
function getAndUpdateProposalStatus(proposals, relays) {
  if (sub_statuses) sub_statuses.stop();
  sub_statuses = ndk.subscribe(
    {
      kinds: proposal_status_kinds,
      "#e": proposals.summaries.map((proposal) => proposal.id)
    },
    {
      closeOnEose: false
    },
    NDKRelaySet.fromRelayUrls(relays, ndk)
  );
  sub_statuses.on("event", (event) => {
    const tagged_proposal_event = event.tagValue("e");
    if (event.kind && proposal_status_kinds.includes(event.kind) && tagged_proposal_event && event.created_at) {
      proposal_summaries.update((proposals2) => {
        return {
          ...proposals2,
          summaries: proposals2.summaries.map((o) => {
            if (o.id === tagged_proposal_event && event.created_at && o.status_date < event.created_at) {
              return {
                ...o,
                status: event.kind,
                status_date: event.created_at
              };
            }
            return o;
          })
        };
      });
    }
  });
  sub_statuses.on("eose", () => {
    proposal_summaries.update((proposals2) => {
      return {
        ...proposals2,
        summaries: proposals2.summaries.map((o) => ({
          ...o,
          status: o.status || proposal_status_open
        }))
      };
    });
  });
}
const extractRepoAFromProposalEvent = (event) => {
  const value = event.tagValue("a");
  if (!value) return void 0;
  const split = value.split(":");
  if (split.length < 3) return void 0;
  return value;
};
const Patch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { event } = $$props;
  let { preview = false } = $$props;
  let content = event ? event.content : "";
  let tags = event ? event.tags : [];
  let commit_id_shorthand = extractTagContent("commit", tags)?.substring(0, 8) || "[commit_id unknown]";
  let commit_message = extractTagContent("description", tags) || extractPatchMessage(content) || "[untitled]";
  let commit_title = commit_message.split("\n")[0];
  let files = parseDiff(content);
  let expand_files = files.map((file) => file.deletions + file.additions < 20);
  if (files.reduce((acc, file) => acc + file.deletions + file.additions, 0) < 60) {
    expand_files = expand_files.map((_) => true);
  }
  let expand_full_files = files.map((_) => false);
  let isAddChange = (change) => change.type == "add";
  let isDeleteChange = (change) => change.type == "del";
  let extractChangeLine = (change, stage) => {
    if (isAddChange(change) || isDeleteChange(change)) {
      return change.ln;
    } else {
      if (change.ln2 === change.ln2) return change.ln1;
      return "#";
    }
  };
  let getFortmattedDiffHtml = (change, language) => {
    try {
      return hljs.highlight(
        change.type == "normal" ? change.content : change.content.substring(1),
        { language }
      ).value;
    } catch {
      return void 0;
    }
  };
  let nevent = nip19.neventEncode({
    id: event.id,
    relays: event.relay ? [event.relay.url] : void 0
  });
  let a_string = extractRepoAFromProposalEvent(event);
  let pointer = a_string ? extractAReference(a_string) : void 0;
  let naddr = pointer ? nip19.naddrEncode(pointer) : void 0;
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  if ($$props.preview === void 0 && $$bindings.preview && preview !== void 0) $$bindings.preview(preview);
  return `${preview ? `<span>Git Patch for <a class="opacity-50"${add_attribute("href", `/e/${naddr}`, 0)}>${escape(pointer?.identifier)}</a>: <a${add_attribute("href", `/e/${nevent}`, 0)}>${escape(commit_title)}</a> by</span>` : `<div class=""><div class="flex rounded-t bg-base-300 p-1"><article class="ml-2 flex-grow font-mono text-sm">${validate_component(ParsedContent, "ParsedContent").$$render($$result, { content: commit_message }, {}, {})}</article> <div class="flex-none p-1 align-middle text-xs text-neutral" data-svelte-h="svelte-u6mpj9">commit</div></div> <div class="flex p-3"><div class="flex-grow text-xs" data-svelte-h="svelte-fk3ziw">Changes:</div> <div class="flex-none text-right font-mono text-xs">${escape(commit_id_shorthand)}</div></div> ${each(files, (file, index) => {
    return `<div class="${"my-2 border border-base-300 " + escape(
      expand_full_files[index] ? "absolute left-0 z-10 w-screen bg-base-300 px-5" : "",
      true
    )}"><div class="flex w-full bg-base-200"><button class="flex shrink flex-grow p-3 text-sm"><div class="shrink text-wrap text-left"><span class="pr-3">${escape(file.to || file.from)}</span> <span class="text-middle flex-none align-middle font-mono text-xs opacity-70">${file.new ? `<span data-svelte-h="svelte-3jrdzi">created file</span> ` : ``}${file.deleted ? `<span data-svelte-h="svelte-ggij9h">deleted file</span> ` : ``}${!file.deleted ? `<span class="text-success">+${escape(file.additions)}</span>` : ``} ${!file.new ? `<span class="text-error">-${escape(file.deletions)}</span>` : ``} </span></div> <div class="flex-grow"></div></button> <button class="flex-none p-3 text-right text-xs opacity-40">${escape(expand_files[index] ? "colapse" : "expand")}</button> <button class="flex-none p-3 text-right text-xs opacity-40" data-svelte-h="svelte-1ca73c6">full
          </button></div> ${expand_files[index] ? `<div class="border-t-1 flex border-base-300 font-mono text-xs"><div class="flex-full select-none text-right">${each(file.chunks, (chunk, index2) => {
      return `${index2 !== 0 ? `<div class="flex w-full bg-base-200" data-svelte-h="svelte-1emv6r1"><div class="w-8 flex-none whitespace-pre pb-2 pr-2 pt-1 opacity-50">...</div> </div>` : ``} ${each(chunk.changes, (change, i) => {
        return `<div class="flex w-full bg-base-100"><div class="${[
          "w-8 flex-none whitespace-pre " + escape(
            change.type == "add" ? "bg-success/50" : change.type == "del" ? "bg-error/50" : "bg-slate-500/20",
            true
          ) + " pr-2 opacity-50",
          (index2 === 0 && i === 0 ? "pt-3" : "") + " " + (index2 === file.chunks.length - 1 && i === chunk.changes.length - 1 ? "pb-3" : "")
        ].join(" ").trim()}">${escape(isAddChange(change) && i !== 0 && isDeleteChange(chunk.changes[i - 1]) ? " " : extractChangeLine(change))}</div> </div>`;
      })}`;
    })}</div> <div class="flex-auto overflow-x-auto"><div class="w-fit">${each(file.chunks, (chunk, index2) => {
      return `${index2 !== 0 ? `<div class="flex h-7 w-full bg-base-200"></div>` : ``} ${each(chunk.changes, (change, i) => {
        return `<div class="flex w-full bg-base-100"><div class="${[
          "w-full flex-grow whitespace-pre " + escape(
            change.type == "add" ? "bg-success/20" : change.type == "del" ? "bg-error/20" : "",
            true
          ),
          (index2 === 0 && i === 0 ? "pt-3" : "") + " " + (index2 === file.chunks.length - 1 && i === chunk.changes.length - 1 ? "pb-3" : "")
        ].join(" ").trim()}">${getFortmattedDiffHtml(change, (file.to || file.from)?.split(".").pop() || "") ? ` <!-- HTML_TAG_START -->${getFortmattedDiffHtml(change, (file.to || file.from)?.split(".").pop() || "")}<!-- HTML_TAG_END -->` : `${escape(change.type == "normal" ? change.content : change.content.substring(1))}`} ${(change.type == "normal" ? change.content : change.content.substring(1)).length === 0 ? ` <span></span>` : ``}</div> </div>`;
      })}`;
    })} </div></div> </div>` : ``}</div>  ${expand_full_files[index] ? `<div class="w-full whitespace-pre font-mono text-xs"><span class="block p-3 text-sm" data-svelte-h="svelte-1gkho6y"></span> ${each(file.chunks, (chunk, index2) => {
      return `${index2 !== 0 ? `<span class="block h-7 p-3" data-svelte-h="svelte-1n1el2s"></span>` : ``} ${each(chunk.changes, (_, i) => {
        return `<span class="${[
          "block",
          (index2 === 0 && i === 0 ? "pt-3" : "") + " " + (index2 === file.chunks.length - 1 && i === chunk.changes.length - 1 ? "pb-3" : "")
        ].join(" ").trim()}" data-svelte-h="svelte-1ymosy4"> 
              </span>`;
      })}`;
    })} </div>` : ``}`;
  })}</div>`}`;
});
const Repo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { event } = $$props;
  const isRepoEvent = (event2) => {
    return Object.keys(event2).includes("web");
  };
  let repo = isRepoEvent(event) ? event : eventToRepoEvent(event);
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  return `${repo ? `<span class="">Git Repository: <a${add_attribute("href", `/r/${repo.naddr}`, 0)}>${escape(repo.name)}</a> by</span>` : ``}`;
});
const IssuePreview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { event } = $$props;
  let nevent = nip19.neventEncode({
    id: event.id,
    relays: event.relay ? [event.relay.url] : void 0
  });
  let a_string = extractRepoAFromProposalEvent(event);
  let pointer = a_string ? extractAReference(a_string) : void 0;
  let naddr = pointer ? nip19.naddrEncode(pointer) : void 0;
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  return `<span>Git Issue for <a class="opacity-50"${add_attribute("href", `/e/${naddr}`, 0)}>${escape(pointer?.identifier)}</a>: <a${add_attribute("href", `/e/${nevent}`, 0)}>${escape(extractIssueTitle(event))}</a> by</span>`;
});
const EventCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $author, $$unsubscribe_author;
  let { event } = $$props;
  let { type = "proposal" } = $$props;
  let { preview = false } = $$props;
  let author = writable({ ...defaults });
  $$unsubscribe_author = subscribe(author, (value) => $author = value);
  let author_unsubsriber;
  onDestroy(() => {
    if (author_unsubsriber) author_unsubsriber();
  });
  const getDtag = (event2) => {
    try {
      const tag = event2.replaceableDTag();
      return tag;
    } catch {
    }
  };
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.preview === void 0 && $$bindings.preview && preview !== void 0) $$bindings.preview(preview);
  {
    {
      if (event && event.pubkey.length > 0) author_unsubsriber = ensureUser(event.pubkey).subscribe((u) => {
        if (u.hexpubkey == event.pubkey) author.set({ ...u });
      });
    }
  }
  $$unsubscribe_author();
  return `${event.kind && [6, 16].includes(event.kind) ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `reposted by`;
      }
    }
  )}` : `${event.kind && event.kind === 5 ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `deletion requested by`;
      }
    }
  )}` : `${event.kind && event.kind === 30001 ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `added to &#39;${escape(getDtag(event) || "unknown")}&#39; list by`;
      }
    }
  )}` : `${event.kind && event.kind == repo_kind ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `${validate_component(Repo, "Repo").$$render($$result, { event }, {}, {})}`;
      }
    }
  )}` : `${preview && event.kind && event.kind === patch_kind ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `${validate_component(Patch, "Patch").$$render($$result, { event, preview }, {}, {})}`;
      }
    }
  )}` : `${preview && event.kind && event.kind === issue_kind ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $author,
      created_at: event.created_at
    },
    {},
    {
      default: () => {
        return `${validate_component(IssuePreview, "IssuePreview").$$render($$result, { event }, {}, {})}`;
      }
    }
  )}` : `${validate_component(EventWrapper, "EventWrapper").$$render(
    $$result,
    {
      type,
      author: $author,
      created_at: event.created_at,
      event
    },
    {},
    {
      default: () => {
        return `${event.kind == patch_kind ? `${isCoverLetter(event.content) ? `${validate_component(ParsedContent, "ParsedContent").$$render(
          $$result,
          {
            content: extractPatchMessage(event.content),
            tags: event.tags
          },
          {},
          {}
        )}` : `${validate_component(Patch, "Patch").$$render($$result, { event }, {}, {})}`}` : `${event.kind && proposal_status_kinds.includes(event.kind) ? `${validate_component(Status_1, "Status").$$render($$result, { type, status: event.kind }, {}, {})}` : `${validate_component(ParsedContent, "ParsedContent").$$render($$result, { content: event.content, tags: event.tags }, {}, {})}`}`}`;
      }
    }
  )}`}`}`}`}`}`}`;
});
const EventPreview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $repo, $$unsubscribe_repo;
  let $event, $$unsubscribe_event;
  let { pointer } = $$props;
  let event = writable(void 0);
  $$unsubscribe_event = subscribe(event, (value) => $event = value);
  const isAddressPointer = (pointer2) => {
    return Object.keys(pointer2).includes("identifier");
  };
  let is_repo = isAddressPointer(pointer) && pointer.kind == repo_kind;
  let repo = is_repo && isAddressPointer(pointer) ? ensureRepo(`${pointer.kind}:${pointer.pubkey}:${pointer.identifier}`) : void 0;
  $$unsubscribe_repo = subscribe(repo, (value) => $repo = value);
  if ($$props.pointer === void 0 && $$bindings.pointer && pointer !== void 0) $$bindings.pointer(pointer);
  $$unsubscribe_repo();
  $$unsubscribe_event();
  return `<div class="card my-3 border border-base-400 shadow-xl">${repo && $repo ? `${validate_component(EventWrapperLite, "EventWrapperLite").$$render(
    $$result,
    {
      author: $repo?.author,
      created_at: $repo?.created_at
    },
    {},
    {
      default: () => {
        return `${validate_component(Repo, "Repo").$$render($$result, { event: $repo }, {}, {})}`;
      }
    }
  )}` : `${$event && $event.pubkey ? `<div class="p-2 pt-0">${validate_component(EventCard, "EventCard").$$render($$result, { event: $event, preview: true }, {}, {})}</div>` : `${`<div class="m-3 text-center text-sm" data-svelte-h="svelte-1nsb0wh">loading...</div>`}`}`}</div>`;
});
const ParsedContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { content = "" } = $$props;
  let { tags = [] } = $$props;
  let fullContent = [];
  if ($$props.content === void 0 && $$bindings.content && content !== void 0) $$bindings.content(content);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0) $$bindings.tags(tags);
  fullContent = parseContent(content, tags);
  return `<div class="prose max-w-prose break-words">${each(fullContent, (part) => {
    return `${isParsedNewLine(part) ? `${part.value.length > 1 ? `<br>` : ``} <br>` : `${isParsedLink(part) ? `${isImage(part.url) ? `<img${add_attribute("src", part.url, 0)}${add_attribute("alt", part.imeta?.alt, 0)}>` : `<a${add_attribute("href", part.url, 0)} target="_blank">${escape(part.url.replace(/https?:\/\/(www\.)?/, ""))} </a>`}` : `${isParsedNpub(part) || isParsedNprofile(part) ? `<div class="badge badge-neutral">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: part.hex, inline: true, size: "sm" }, {}, {})} </div>` : `${isParsedNevent(part) || isParsedNote(part) || isParsedNaddr(part) ? `${validate_component(EventPreview, "EventPreview").$$render($$result, { pointer: part.data }, {}, {})}` : `${isParsedText(part) ? `${escape(part.value)}` : ``}`}`}`}`}`;
  })}</div>`;
});
const UserHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let profile;
  let loading;
  let display_name;
  let { user = { ...defaults } } = $$props;
  let { inline = false } = $$props;
  let { size = "md" } = $$props;
  let { avatar_only = false } = $$props;
  let { in_event_header = false } = $$props;
  let { link_to_profile = true } = $$props;
  let user_object = { ...defaults };
  let unsubscriber;
  onDestroy(() => {
    if (unsubscriber) unsubscriber();
  });
  if ($$props.user === void 0 && $$bindings.user && user !== void 0) $$bindings.user(user);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0) $$bindings.inline(inline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.avatar_only === void 0 && $$bindings.avatar_only && avatar_only !== void 0) $$bindings.avatar_only(avatar_only);
  if ($$props.in_event_header === void 0 && $$bindings.in_event_header && in_event_header !== void 0) $$bindings.in_event_header(in_event_header);
  if ($$props.link_to_profile === void 0 && $$bindings.link_to_profile && link_to_profile !== void 0) $$bindings.link_to_profile(link_to_profile);
  {
    {
      if (typeof user === "string") {
        if (unsubscriber) unsubscriber();
        unsubscriber = ensureUser(user).subscribe((u) => {
          user_object = { ...u };
        });
      } else user_object = user;
    }
  }
  ({ profile, loading } = user_object);
  display_name = getName(user_object);
  return `  <div${add_classes(((inline ? "inline-block" : "") + " " + (link_to_profile ? "cursor-pointer" : "")).trim())}><div${add_classes(((!inline ? "my-2" : "") + " " + (size === "xs" ? "text-xs" : "") + " " + (size === "sm" ? "text-sm" : "") + " " + (size === "md" ? "text-md" : "") + " " + (inline ? "align-middle" : "") + " " + (!inline ? "flex" : "") + " " + (!inline ? "items-center" : "")).trim())}><div class="${[
    "avatar",
    (inline ? "inline-block" : "") + " " + (inline ? "align-middle" : "") + " " + (!inline ? "flex-none" : "")
  ].join(" ").trim()}"><div class="${[
    "rounded",
    (inline ? "inline-block" : "") + " " + (!inline && size === "full" ? "h-32" : "") + " " + (!inline && size === "full" ? "w-32" : "") + " " + (!inline && size === "md" ? "h-8" : "") + " " + (!inline && size === "md" ? "w-8" : "") + " " + (!inline && size === "sm" ? "h-4" : "") + " " + (!inline && size === "sm" ? "w-4" : "") + " " + (inline && size === "md" ? "h-5" : "") + " " + (inline && size === "md" ? "w-5" : "") + " " + (inline && size === "sm" || size === "xs" ? "h-3.5" : "") + " " + (inline && size === "sm" || size === "xs" ? "w-3.5" : "") + " " + (!profile && loading ? "skeleton" : "") + " " + (!loading && (!profile || !profile.image) ? "bg-neutral" : "")
  ].join(" ").trim()}">${profile && profile?.image ? `<img class="my-0"${add_attribute("src", profile?.image, 0)}${add_attribute("alt", display_name, 0)}>` : ``}</div></div> <div${add_classes(((size === "full" ? "text-xl" : "") + " " + (size === "full" ? "width-max-prose" : "") + " " + (!inline && size === "full" ? "pl-4" : "") + " " + (!inline && size === "md" ? "pl-3" : "") + " " + (!inline && (size === "sm" || size === "xs") ? "pl-2" : "") + " " + (inline ? "pl-0" : "") + " " + (!inline ? "flex-auto" : "") + " " + (!inline ? "m-auto" : "") + " " + (inline ? "inline-block" : "") + " " + (avatar_only ? "hidden" : "") + " " + (in_event_header ? "opacity-40" : "")).trim())}>${loading ? `<div class="${[
    "skeleton w-24",
    (size === "md" ? "h-4" : "") + " " + (size === "sm" ? "h-3" : "") + " " + (size === "xs" ? "h-2.5" : "")
  ].join(" ").trim()}"></div>` : `<span${add_classes((in_event_header || size === "full" ? "font-bold" : "").trim())}>${escape(display_name)}</span>`} ${size === "full" ? `${validate_component(CopyField, "CopyField").$$render(
    $$result,
    {
      icon: icons_misc.key,
      content: user_object.npub,
      no_border: true,
      truncate: [10, 10]
    },
    {},
    {}
  )} ${profile && profile.lud16 ? `${validate_component(CopyField, "CopyField").$$render(
    $$result,
    {
      icon: icons_misc.lightning,
      content: profile.lud16,
      no_border: true
    },
    {},
    {}
  )}` : ``} ${profile && profile.website ? `<a${add_attribute("href", profile.website, 0)} target="_blank" class="items items-top mt-1 flex w-full opacity-60"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mr-1 inline h-4 w-4 flex-none fill-base-content opacity-50">${each(icons_misc.link, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg> <div class="link-secondary text-sm">${escape(profile.website)}</div></a>` : ``} ${size === "full" && profile && profile.about ? `<div class="items items-top flex max-w-md opacity-60"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mr-1 mt-1 inline h-4 w-4 flex-none fill-base-content opacity-50">${each(icons_misc.info, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg> ${loading ? `<div class="w.max-lg skeleton h-3"></div>` : `<div class="text-sm">${validate_component(ParsedContent, "ParsedContent").$$render($$result, { content: profile?.about }, {}, {})}</div>`}</div>` : ``}` : ``}</div></div></div>`;
});
export {
  EventCard as E,
  Status as S,
  UserHeader as U,
  login as a,
  proposal_icon_path as b,
  icons_misc as c,
  ensureUser as d,
  ensureProposalSummaries as e,
  getUserRelays as g,
  issue_icon_path as i,
  logged_in_user as l,
  nip07_plugin as n,
  proposal_summaries as p,
  user_relays as u
};
