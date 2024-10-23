import { c as create_ssr_component, e as escape, h as add_attribute, v as validate_component, f as each, a as subscribe } from "./ssr.js";
import { c as icons_misc, U as UserHeader, p as proposal_summaries, b as proposal_icon_path, i as issue_icon_path } from "./UserHeader.js";
import { nip19 } from "nostr-tools";
import { I as InstallNgit } from "./InstallNgit.js";
import { K as event_defaults, k as selected_repo_event, u as ensureSelectedRepoCollection, b as base_relays, E as awaitSelectedRepoCollection, F as selectRepoFromCollection, i as issue_kind, a as repo_kind, n as ndk, I as extractIssueTitle, J as extractIssueDescription, H as proposal_status_kinds, l as proposal_status_open, j as selected_repo_readme } from "./type.js";
import { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { w as writable } from "./index2.js";
import { s as summary_defaults } from "./type2.js";
import { C as Container } from "./Container.js";
const AlertWarning = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div role="alert" class="m-auto max-w-xl"><div role="alert" class="alert alert-warning m-auto mt-6 bg-yellow-300"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" viewBox="0 0 256 256"><path fill="currentColor" d="M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12"></path></svg> <div>${slots.default ? slots.default({}) : ``}</div></div></div>`;
});
const RepoDetails = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let short_descrption;
  let nostr_url;
  let event_not_found;
  let { event_id: event_id_1, naddr: naddr_1, identifier: identifier_1, author: author_1, unique_commit: unique_commit_1, name: name_1, description: description_1, clone: clone_1, web: web_1, tags: tags_1, maintainers: maintainers_1, relays: relays_1, referenced_by: referenced_by_1, most_recent_reference_timestamp: most_recent_reference_timestamp_1, created_at: created_at_1, loading: loading_1 } = event_defaults;
  let { event_id = event_id_1, naddr = naddr_1, identifier = identifier_1, author = author_1, unique_commit = unique_commit_1, name = name_1, description = description_1, clone = clone_1, web = web_1, tags = tags_1, maintainers = maintainers_1, relays = relays_1, referenced_by = referenced_by_1, most_recent_reference_timestamp = most_recent_reference_timestamp_1, created_at = created_at_1, loading = loading_1 } = $$props;
  const create_nostr_url = (maintainers2, identifier2, relays2) => {
    if (identifier2.length > 0 && maintainers2.length > 0) {
      let npub = nip19.npubEncode(maintainers2[0]);
      if (relays2.length > 0) {
        let relay = relays2[0].replace(/\/+$/, "");
        if (/^[a-zA-Z0-9.]+$/.test(relay.replace("wss://", ""))) {
          return `nostr://${npub}/${relay.replace("wss://", "")}/${identifier2}`;
        }
        return `nostr://${npub}/${encodeURIComponent(relay)}/${identifier2}`;
      }
      return `nostr://${npub}/${identifier2}`;
    }
    return "";
  };
  let git_url_copied = false;
  if ($$props.event_id === void 0 && $$bindings.event_id && event_id !== void 0) $$bindings.event_id(event_id);
  if ($$props.naddr === void 0 && $$bindings.naddr && naddr !== void 0) $$bindings.naddr(naddr);
  if ($$props.identifier === void 0 && $$bindings.identifier && identifier !== void 0) $$bindings.identifier(identifier);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.unique_commit === void 0 && $$bindings.unique_commit && unique_commit !== void 0) $$bindings.unique_commit(unique_commit);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.clone === void 0 && $$bindings.clone && clone !== void 0) $$bindings.clone(clone);
  if ($$props.web === void 0 && $$bindings.web && web !== void 0) $$bindings.web(web);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0) $$bindings.tags(tags);
  if ($$props.maintainers === void 0 && $$bindings.maintainers && maintainers !== void 0) $$bindings.maintainers(maintainers);
  if ($$props.relays === void 0 && $$bindings.relays && relays !== void 0) $$bindings.relays(relays);
  if ($$props.referenced_by === void 0 && $$bindings.referenced_by && referenced_by !== void 0) $$bindings.referenced_by(referenced_by);
  if ($$props.most_recent_reference_timestamp === void 0 && $$bindings.most_recent_reference_timestamp && most_recent_reference_timestamp !== void 0) $$bindings.most_recent_reference_timestamp(most_recent_reference_timestamp);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  short_descrption = !description && description.length > 500 ? description.slice(0, 450) + "..." : description;
  nostr_url = create_nostr_url(maintainers, identifier, relays);
  event_not_found = !loading && created_at == 0;
  return `<div class="prose w-full max-w-md">${event_not_found ? `<h4 class="mt-0 pt-1" data-svelte-h="svelte-tgsil0">identifier</h4> <p class="my-2 break-words text-sm">${escape(identifier)}</p>` : `${name == identifier ? `${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${!name || name.length == 0 ? `<h4 class="mt-0 pt-1" data-svelte-h="svelte-tst7rk">name / identifier</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 class="mt-0 pt-1" data-svelte-h="svelte-tst7rk">name / identifier</h4> <p class="my-2 break-words text-sm">${escape(name)}</p>`}`}` : `${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${!name || name.length == 0 ? `<h4 data-svelte-h="svelte-1k37uah">name</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 data-svelte-h="svelte-1k37uah">name</h4> <p class="my-2 break-words text-sm">${escape(name)}</p>`}`} ${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${!identifier || identifier.length == 0 ? `<h4 data-svelte-h="svelte-1uhz9r5">identifier</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 data-svelte-h="svelte-1uhz9r5">identifier</h4> <p class="my-2 break-words text-sm">${escape(identifier)}</p>`}`}`} ${!loading ? `<div class="dropdown dropdown-end mt-3"><div${add_attribute("tabindex", 0, 0)} class="btn btn-success btn-sm text-base-400" data-svelte-h="svelte-17b6q3j">clone
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 flex-none fill-success-content"><path fill="currentColor" d="M11.646 15.146L5.854 9.354a.5.5 0 0 1 .353-.854h11.586a.5.5 0 0 1 .353.854l-5.793 5.792a.5.5 0 0 1-.707 0"></path></svg></div> <ul${add_attribute("tabindex", 0, 0)} class="w-md menu dropdown-content z-[1] ml-0 rounded-box bg-base-300 p-2 shadow"><li class="prose"><div><div><h4 class="mt-0" data-svelte-h="svelte-181g2vw">1. install ngit and git-remote-nostr</h4> ${validate_component(InstallNgit, "InstallNgit").$$render($$result, { size: "sm" }, {}, {})}</div></div></li> <li class="m-0 p-0">   <div class="group cursor-pointer rounded-md"><div><h4 class="mt-0 pt-0">2. copy git clone url
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${[
    "ml-1 inline h-4 w-4 flex-none fill-base-content opacity-50 group-hover:opacity-100",
    "fill-base-content "
  ].join(" ").trim()}">${each(icons_misc.copy, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg> ${``}</h4> <p class="my-2 break-words border p-2 text-xs">${escape(nostr_url)}</p></div></div></li></ul></div>` : ``} ${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${!short_descrption || description.length == 0 ? `<h4 data-svelte-h="svelte-12hqll4">description</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 data-svelte-h="svelte-12hqll4">description</h4> <p class="my-2 break-words text-sm">${escape(short_descrption)}</p>`}`} <div>${loading ? `<div class="badge skeleton w-20"></div> <div class="badge skeleton w-20"></div>` : `${each(tags, (tag) => {
    return `<div class="badge badge-secondary mr-2">${escape(tag)}</div>`;
  })}`}</div> <div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div>` : `${clone.length == 0 ? `<div></div>` : `<h4>git servers ${``}</h4> ${each(clone, (git_url) => {
    return `   <div class="${[
      "group my-2 mt-3 cursor-pointer break-words text-xs",
      (git_url_copied === git_url ? "text-success" : "") + " " + (git_url_copied === git_url ? "opacity-50" : "")
    ].join(" ").trim()}">${escape(git_url)} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${[
      "ml-1 inline h-4 w-4 flex-none fill-base-content opacity-50",
      (git_url_copied !== git_url ? "group-hover:opacity-100" : "") + " " + (git_url_copied !== git_url ? "fill-base-content" : "") + " " + (git_url_copied === git_url ? "fill-success" : "") + " " + (git_url_copied === git_url ? "opacity-100" : "")
    ].join(" ").trim()}">${each(icons_misc.copy, (d) => {
      return `<path${add_attribute("d", d, 0)}></path>`;
    })}</svg> </div>`;
  })}`}`}</div> <div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div> <div class="badge skeleton my-2 block w-40"></div>` : `${web.length == 0 ? `<h4 data-svelte-h="svelte-np4f58">websites</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 data-svelte-h="svelte-np4f58">websites</h4> ${each(web, (site) => {
    return `<a${add_attribute("href", site, 0)} target="_blank" class="link link-primary my-2 break-words text-sm">${escape(site)} </a>`;
  })}`}`}</div>`} <div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div> <div class="badge skeleton my-2 block w-40"></div>` : `${maintainers.length == 0 ? `<div></div>` : `<h4>${event_not_found ? `author` : `maintainers`} ${``}</h4> ${each(maintainers, (maintainer) => {
    return `<div class="my-2 mt-3 break-words text-xs">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: maintainer }, {}, {})} </div>`;
  })}`}`}</div> ${!event_not_found ? `<div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div> <div class="badge skeleton my-2 block w-40"></div>` : `${relays.length == 0 ? `<h4 data-svelte-h="svelte-1fbls8w">relays</h4> <div data-svelte-h="svelte-14qvfhu">none</div>` : `<h4 data-svelte-h="svelte-1fbls8w">relays</h4> ${each(relays, (relay) => {
    return `<div class="badge badge-secondary badge-sm my-2 block">${escape(relay)}</div>`;
  })}`}`}</div> ${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${!unique_commit || unique_commit.length == 0 ? `<h4 data-svelte-h="svelte-pj1sdv">earliest unique commit</h4> <p class="my-2 break-words text-xs" data-svelte-h="svelte-1t4dk9">not specified</p>` : `<h4 data-svelte-h="svelte-pj1sdv">earliest unique commit</h4> <p class="my-2 break-words text-xs">${escape(unique_commit)}</p>`}`}` : ``} ${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${naddr && naddr.length > 0 ? `   <div class="group -ml-3 mt-3 cursor-pointer rounded-md p-3 hover:bg-base-300"><h4 class="mt-0 pt-0">naddr
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${[
    "ml-1 inline h-4 w-4 flex-none fill-base-content opacity-50 group-hover:opacity-100",
    "fill-base-content "
  ].join(" ").trim()}">${each(icons_misc.copy, (d) => {
    return `<path${add_attribute("d", d, 0)}></path>`;
  })}</svg> ${``}</h4> <p class="my-2 break-words text-xs">${escape(naddr)}</p></div>` : ``}`} ${event_not_found ? `<div class="text-xs">${validate_component(AlertWarning, "AlertWarning").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="pb-1 font-semibold" data-svelte-h="svelte-sm4obg">missing repository details</div> <div data-svelte-h="svelte-1okttm1">cannot find referenced repository event</div>`;
    }
  })}</div>` : ``}</div>`;
});
const RepoDetails_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  let { a = "" } = $$props;
  ensureSelectedRepoCollection(a);
  if ($$props.a === void 0 && $$bindings.a && a !== void 0) $$bindings.a(a);
  $$unsubscribe_selected_repo_event();
  return `${validate_component(RepoDetails, "RepoDetails").$$render($$result, Object.assign({}, $selected_repo_event), {}, {})}`;
});
const issue_summaries = writable({
  repo_a: "",
  summaries: [],
  loading: false
});
let selected_repo_a = "";
let sub;
const ensureIssueSummaries = async (repo_a) => {
  if (selected_repo_a == repo_a) return;
  issue_summaries.set({
    repo_a,
    summaries: [],
    loading: repo_a !== ""
  });
  if (sub) sub.stop();
  if (sub_statuses) sub_statuses.stop();
  selected_repo_a = repo_a;
  setTimeout(() => {
    issue_summaries.update((summaries) => {
      return {
        ...summaries,
        loading: false
      };
    });
  }, 6e3);
  let relays_to_use = [...base_relays];
  let filter = {
    kinds: [issue_kind],
    limit: 100
  };
  if (repo_a) {
    const repo_collection = await awaitSelectedRepoCollection(repo_a);
    const repo = selectRepoFromCollection(repo_collection);
    if (!repo) {
      return;
    }
    relays_to_use = repo.relays.length > 3 ? repo.relays : [...base_relays].concat(repo.relays);
    filter = {
      kinds: [issue_kind],
      "#a": repo.maintainers.map((m) => `${repo_kind}:${m}:${repo.identifier}`),
      limit: 100
    };
  }
  sub = ndk.subscribe(
    filter,
    {
      closeOnEose: false
    },
    NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
  );
  sub.on("event", (event) => {
    try {
      if (event.kind == issue_kind) {
        if (!extractRepoIdentiferFromIssueEvent(event) && !repo_a) {
          return;
        }
        issue_summaries.update((issues) => {
          return {
            ...issues,
            summaries: [
              ...issues.summaries,
              {
                ...summary_defaults,
                id: event.id,
                repo_a: extractRepoIdentiferFromIssueEvent(event) || repo_a || "",
                title: extractIssueTitle(event),
                descritpion: extractIssueDescription(event.content),
                created_at: event.created_at,
                comments: 0,
                author: event.pubkey,
                loading: false
              }
            ]
          };
        });
      }
    } catch {
    }
  });
  sub.on("eose", () => {
    issue_summaries.update((issues) => {
      getAndUpdateIssueStatus(issues, relays_to_use);
      return {
        ...issues,
        loading: false
      };
    });
  });
};
let sub_statuses;
function getAndUpdateIssueStatus(issues, relays) {
  if (sub_statuses) sub_statuses.stop();
  sub_statuses = ndk.subscribe(
    {
      kinds: proposal_status_kinds,
      "#e": issues.summaries.map((issue) => issue.id)
    },
    {
      closeOnEose: false
    },
    NDKRelaySet.fromRelayUrls(relays, ndk)
  );
  sub_statuses.on("event", (event) => {
    const tagged_issue_event = event.tagValue("e");
    if (event.kind && proposal_status_kinds.includes(event.kind) && tagged_issue_event && event.created_at) {
      issue_summaries.update((issues2) => {
        return {
          ...issues2,
          summaries: issues2.summaries.map((o) => {
            if (o.id === tagged_issue_event && event.created_at && o.status_date < event.created_at) {
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
    issue_summaries.update((issues2) => {
      return {
        ...issues2,
        summaries: issues2.summaries.map((o) => ({
          ...o,
          status: o.status || proposal_status_open
        }))
      };
    });
  });
}
const extractRepoIdentiferFromIssueEvent = (event) => {
  const value = event.tagValue("a");
  if (!value) return void 0;
  const split = value.split(":");
  if (split.length < 3) return void 0;
  return value;
};
const RepoMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_repo_readme, $$unsubscribe_selected_repo_readme;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  let $proposal_summaries, $$unsubscribe_proposal_summaries;
  let $issue_summaries, $$unsubscribe_issue_summaries;
  $$unsubscribe_selected_repo_readme = subscribe(selected_repo_readme, (value) => $selected_repo_readme = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  $$unsubscribe_proposal_summaries = subscribe(proposal_summaries, (value) => $proposal_summaries = value);
  $$unsubscribe_issue_summaries = subscribe(issue_summaries, (value) => $issue_summaries = value);
  let { selected_tab = "about" } = $$props;
  if ($$props.selected_tab === void 0 && $$bindings.selected_tab && selected_tab !== void 0) $$bindings.selected_tab(selected_tab);
  $$unsubscribe_selected_repo_readme();
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_proposal_summaries();
  $$unsubscribe_issue_summaries();
  return `<div class="flex border-b border-base-400"><div role="tablist" class="tabs tabs-bordered flex-none">${!$selected_repo_readme.failed ? `<a${add_attribute("href", `/r/${$selected_repo_event.naddr}`, 0)} class="${["tab", selected_tab === "about" ? "tab-active" : ""].join(" ").trim()}">About</a>` : ``} <a${add_attribute("href", `/r/${$selected_repo_event.naddr}/proposals`, 0)} class="${["tab", selected_tab === "proposals" ? "tab-active" : ""].join(" ").trim()}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mb-1 mr-1 h-4 w-4 flex-none fill-base-content pt-1 opacity-50"><path${add_attribute("d", proposal_icon_path.open_pull, 0)}></path></svg>
      Proposals
      ${$proposal_summaries.loading ? `<span class="loading loading-spinner loading-xs ml-2 text-neutral"></span>` : `${$proposal_summaries.summaries.filter((s) => s.status === proposal_status_open).length > 0 ? `<span class="badge badge-neutral badge-sm ml-2">${escape($proposal_summaries.summaries.filter((s) => s.status === proposal_status_open).length)}</span>` : ``}`}</a> <a${add_attribute("href", `/r/${$selected_repo_event.naddr}/issues`, 0)} class="${["tab", selected_tab === "issues" ? "tab-active" : ""].join(" ").trim()}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mb-1 mr-1 h-4 w-4 flex-none fill-base-content pt-1 opacity-50">${each(issue_icon_path.open, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}</svg>
      Issues
      ${$issue_summaries.loading ? `<span class="loading loading-spinner loading-xs ml-2 text-neutral"></span>` : `${$issue_summaries.summaries.filter((s) => s.status === proposal_status_open).length > 0 ? `<span class="badge badge-neutral badge-sm ml-2">${escape($issue_summaries.summaries.filter((s) => s.status === proposal_status_open).length)}</span>` : ``}`}</a></div> <div class="flex-grow"></div></div>`;
});
const RepoHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { event_id: event_id_1, identifier: identifier_1, naddr: naddr_1, unique_commit: unique_commit_1, name: name_1, author: author_1, description: description_1, clone: clone_1, web: web_1, tags: tags_1, maintainers: maintainers_1, relays: relays_1, referenced_by: referenced_by_1, created_at: created_at_1, most_recent_reference_timestamp: most_recent_reference_timestamp_1, loading: loading_1 } = event_defaults;
  let { event_id = event_id_1, identifier = identifier_1, naddr = naddr_1, unique_commit = unique_commit_1, name = name_1, author = author_1, description = description_1, clone = clone_1, web = web_1, tags = tags_1, maintainers = maintainers_1, relays = relays_1, referenced_by = referenced_by_1, created_at = created_at_1, most_recent_reference_timestamp = most_recent_reference_timestamp_1, loading = loading_1 } = $$props;
  let { selected_tab = "about" } = $$props;
  let short_name;
  if ($$props.event_id === void 0 && $$bindings.event_id && event_id !== void 0) $$bindings.event_id(event_id);
  if ($$props.identifier === void 0 && $$bindings.identifier && identifier !== void 0) $$bindings.identifier(identifier);
  if ($$props.naddr === void 0 && $$bindings.naddr && naddr !== void 0) $$bindings.naddr(naddr);
  if ($$props.unique_commit === void 0 && $$bindings.unique_commit && unique_commit !== void 0) $$bindings.unique_commit(unique_commit);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.clone === void 0 && $$bindings.clone && clone !== void 0) $$bindings.clone(clone);
  if ($$props.web === void 0 && $$bindings.web && web !== void 0) $$bindings.web(web);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0) $$bindings.tags(tags);
  if ($$props.maintainers === void 0 && $$bindings.maintainers && maintainers !== void 0) $$bindings.maintainers(maintainers);
  if ($$props.relays === void 0 && $$bindings.relays && relays !== void 0) $$bindings.relays(relays);
  if ($$props.referenced_by === void 0 && $$bindings.referenced_by && referenced_by !== void 0) $$bindings.referenced_by(referenced_by);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  if ($$props.most_recent_reference_timestamp === void 0 && $$bindings.most_recent_reference_timestamp && most_recent_reference_timestamp !== void 0) $$bindings.most_recent_reference_timestamp(most_recent_reference_timestamp);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  if ($$props.selected_tab === void 0 && $$bindings.selected_tab && selected_tab !== void 0) $$bindings.selected_tab(selected_tab);
  {
    {
      if (name && name.length > 45) short_name = name.slice(0, 45) + "...";
      else if (name && name.length >= 0) short_name = name;
      else if (identifier && identifier.length > 45) short_name = identifier.slice(0, 45) + "...";
      else if (identifier && identifier.length >= 0) short_name = identifier;
      else short_name = "Untitled";
    }
  }
  return `<div class="border-b border-accent-content bg-base-300">${validate_component(Container, "Container").$$render($$result, { no_wrap: true }, {}, {
    default: () => {
      return `${loading ? `<div class="p-3" data-svelte-h="svelte-1fnul7z"><div class="skeleton h-6 w-28 bg-base-200"></div></div>` : `<a${add_attribute("href", `/r/${naddr}`, 0)} class="strong btn btn-ghost mb-0 mt-0 break-words px-3 text-sm">${escape(short_name)}</a> ${created_at === 0 && name.length === 0 ? `<span class="text-xs text-warning">cannot find referenced repository event by <div class="badge bg-base-400 text-warning">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: author, inline: true, size: "xs" }, {}, {})}</div></span>` : ``}`} ${validate_component(RepoMenu, "RepoMenu").$$render($$result, { selected_tab }, {}, {})}`;
    }
  })}</div>`;
});
export {
  RepoHeader as R,
  RepoDetails_1 as a,
  ensureIssueSummaries as e,
  issue_summaries as i
};
