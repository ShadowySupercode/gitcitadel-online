import { c as create_ssr_component, e as escape, h as add_attribute, f as each, v as validate_component } from "./ssr.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { c as aToNaddr, y as naddrToPointer, l as proposal_status_open, o as proposal_status_closed, x as proposal_status_draft, m as proposal_status_applied, z as summary_defaults } from "./type.js";
import { b as proposal_icon_path, i as issue_icon_path, U as UserHeader } from "./UserHeader.js";
import { nip19 } from "nostr-tools";
const ProposalsListItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  dayjs.extend(relativeTime);
  let { type = "proposal" } = $$props;
  let { title: title_1, descritpion: descritpion_1, id: id_1, repo_a: repo_a_1, comments: comments_1, status: status_1, status_date: status_date_1, author: author_1, created_at: created_at_1, loading: loading_1 } = summary_defaults;
  let { title = title_1, descritpion = descritpion_1, id = id_1, repo_a = repo_a_1, comments = comments_1, status = status_1, status_date = status_date_1, author = author_1, created_at = created_at_1, loading = loading_1 } = $$props;
  let { show_repo = false } = $$props;
  let { repo_naddr_override = void 0 } = $$props;
  let short_title;
  let created_at_ago;
  let repo_naddr = "";
  let repo_identifier = "";
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.descritpion === void 0 && $$bindings.descritpion && descritpion !== void 0) $$bindings.descritpion(descritpion);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.repo_a === void 0 && $$bindings.repo_a && repo_a !== void 0) $$bindings.repo_a(repo_a);
  if ($$props.comments === void 0 && $$bindings.comments && comments !== void 0) $$bindings.comments(comments);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  if ($$props.status_date === void 0 && $$bindings.status_date && status_date !== void 0) $$bindings.status_date(status_date);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  if ($$props.show_repo === void 0 && $$bindings.show_repo && show_repo !== void 0) $$bindings.show_repo(show_repo);
  if ($$props.repo_naddr_override === void 0 && $$bindings.repo_naddr_override && repo_naddr_override !== void 0) $$bindings.repo_naddr_override(repo_naddr_override);
  {
    {
      if (title.length > 70) short_title = title.slice(0, 65) + "...";
      else if (title.length == 0) short_title = "Untitled";
      else short_title = title;
      created_at_ago = created_at ? dayjs(created_at * 1e3).fromNow() : "";
    }
  }
  {
    {
      if (repo_a.length > 0) {
        repo_naddr = repo_naddr_override || aToNaddr(repo_a) || "";
        if (repo_naddr_override) {
          repo_identifier = naddrToPointer(repo_naddr)?.identifier || "";
        }
      }
    }
  }
  return `<li class="${"flex p-2 pt-4 " + escape(!loading ? "cursor-pointer hover:bg-base-200" : "", true)}">  ${loading || !status ? `<div class="skeleton h-5 w-5 flex-none pt-1"></div>` : `${status === proposal_status_open ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-success pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.open_patch, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.open, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg>` : `${status === proposal_status_closed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-neutral-content pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.close, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.closed, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg>` : `${status === proposal_status_draft ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-neutral-content pt-1"><path${add_attribute("d", proposal_icon_path.draft, 0)}></path></svg>` : `${status === proposal_status_applied ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5 flex-none fill-primary pt-1">${type === "proposal" ? `<path${add_attribute("d", proposal_icon_path.applied, 0)}></path>` : `${type === "issue" ? `${each(issue_icon_path.resolved, (p) => {
    return `<path${add_attribute("d", p, 0)}></path>`;
  })}` : ``}`}</svg>` : ``}`}`}`}`} <a href="${"/r/" + escape(repo_naddr, true) + "/" + escape(type, true) + "s/" + escape(nip19.noteEncode(id) || "", true)}" class="${[
    "ml-3 grow overflow-hidden text-xs text-neutral-content",
    loading ? "pointer-events-none" : ""
  ].join(" ").trim()}">${loading ? `<div class="skeleton h-5 w-60 flex-none pt-1"></div> <div class="skeleton mb-1 mt-3 h-3 w-40 flex-none"></div>` : `<div class="text-sm text-base-content">${escape(short_title)}</div>  <ul class="pt-2">${comments > 0 ? `<li class="mr-3 inline align-middle"> <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3 flex-none fill-base-content pt-0" viewBox="0 0 16 16"><path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg> ${escape(comments)}</li>` : ``} <li class="mr-3 inline">opened ${escape(created_at_ago)}</li> <li class="inline">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: author, inline: true, size: "xs" }, {}, {})}</li> ${show_repo && repo_identifier.length > 0 ? `<li class="ml-3 inline"><a class="link-primary z-10" href="${"/r/" + escape(repo_naddr, true)}">${escape(repo_identifier)}</a></li>` : ``}</ul>`}</a> </li>`;
});
const ProposalsList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { proposals_or_issues = [] } = $$props;
  let { repo_naddr_override = void 0 } = $$props;
  let { loading = false } = $$props;
  let { show_repo = false } = $$props;
  let { limit = 0 } = $$props;
  let { allow_more = true } = $$props;
  let { sort_youngest_first = true } = $$props;
  let current_limit = limit;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.proposals_or_issues === void 0 && $$bindings.proposals_or_issues && proposals_or_issues !== void 0) $$bindings.proposals_or_issues(proposals_or_issues);
  if ($$props.repo_naddr_override === void 0 && $$bindings.repo_naddr_override && repo_naddr_override !== void 0) $$bindings.repo_naddr_override(repo_naddr_override);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  if ($$props.show_repo === void 0 && $$bindings.show_repo && show_repo !== void 0) $$bindings.show_repo(show_repo);
  if ($$props.limit === void 0 && $$bindings.limit && limit !== void 0) $$bindings.limit(limit);
  if ($$props.allow_more === void 0 && $$bindings.allow_more && allow_more !== void 0) $$bindings.allow_more(allow_more);
  if ($$props.sort_youngest_first === void 0 && $$bindings.sort_youngest_first && sort_youngest_first !== void 0) $$bindings.sort_youngest_first(sort_youngest_first);
  return `<div class="">${title.length > 0 ? `<div class="prose"><h4>${escape(title)}</h4></div>` : ``} ${proposals_or_issues.length == 0 && !loading ? `<p class="prose" data-svelte-h="svelte-1tqibyu">None</p>` : ``} <ul class="divide-y divide-base-400">${each(
    sort_youngest_first ? proposals_or_issues.sort((a, b) => (b.created_at || 0) - (a.created_at || 0)) : proposals_or_issues,
    (proposal, index) => {
      return `${current_limit === 0 || index + 1 <= current_limit ? `${validate_component(ProposalsListItem, "ProposalsListItem").$$render($$result, Object.assign({}, proposal, { repo_naddr_override }, { show_repo }), {}, {})}` : ``}`;
    }
  )} ${loading ? `${validate_component(ProposalsListItem, "ProposalsListItem").$$render($$result, { loading: true }, {}, {})} ${proposals_or_issues.length == 0 ? `${validate_component(ProposalsListItem, "ProposalsListItem").$$render($$result, { loading: true }, {}, {})} ${validate_component(ProposalsListItem, "ProposalsListItem").$$render($$result, { loading: true }, {}, {})}` : ``}` : `${allow_more && limit !== 0 && proposals_or_issues.length > current_limit ? `<button class="btn mt-3 p-3 font-normal" data-svelte-h="svelte-5mss9b">more</button>` : ``}`}</ul></div>`;
});
export {
  ProposalsList as P
};
