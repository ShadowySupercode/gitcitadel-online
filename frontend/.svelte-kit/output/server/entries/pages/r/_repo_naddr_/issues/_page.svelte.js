import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, h as add_attribute } from "../../../../../chunks/ssr.js";
import { P as ProposalsList } from "../../../../../chunks/ProposalsList.js";
import { l as proposal_status_open, m as proposal_status_applied, o as proposal_status_closed, k as selected_repo_event, q as statusKindtoText } from "../../../../../chunks/type.js";
import { i as issue_summaries } from "../../../../../chunks/RepoHeader.js";
import { R as RepoPageWrapper } from "../../../../../chunks/RepoPageWrapper.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $issue_summaries, $$unsubscribe_issue_summaries;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  $$unsubscribe_issue_summaries = subscribe(issue_summaries, (value) => $issue_summaries = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  let status = proposal_status_open;
  let filtered = [];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  filtered = $issue_summaries.summaries.filter((s) => s.status === status);
  $$unsubscribe_issue_summaries();
  $$unsubscribe_selected_repo_event();
  return `${$$result.head += `<!-- HEAD_svelte-bf5nez_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)} - issues</title>`, ""}<!-- HEAD_svelte-bf5nez_END -->`, ""} ${validate_component(RepoPageWrapper, "RepoPageWrapper").$$render($$result, { repo_naddr, selected_tab: "issues" }, {}, {
    default: () => {
      return `<div class="mt-2 rounded-tr-lg border border-base-400"><div class="flex rounded-r-lg bg-slate-900"><div class="flex-none"><div class="tabs tabs-lifted tabs-xs p-2"><button role="tab" class="${[
        "tab",
        " font-bold"
      ].join(" ").trim()}">${escape($issue_summaries.summaries.filter((s) => s.status === proposal_status_open).length)} Open</button> <button role="tab" class="${[
        "tab",
        "opacity-50 "
      ].join(" ").trim()}">${escape($issue_summaries.summaries.filter((s) => s.status === proposal_status_applied).length)} Completed</button> <button role="tab" class="${[
        "tab",
        "opacity-50 "
      ].join(" ").trim()}">${escape($issue_summaries.summaries.filter((s) => s.status === proposal_status_closed).length)} Closed</button></div></div> <div class="flex-auto"></div> <div class="flex-none"><a class="btn btn-success btn-sm h-full text-base-400"${add_attribute("href", `/r/${repo_naddr}/issues/new`, 0)}>create issue</a></div></div> ${!$issue_summaries.loading && filtered.length === 0 ? `<div class="py-10 text-center lowercase">can&#39;t find any ${escape(statusKindtoText(status, "issue"))} issues</div>` : `${validate_component(ProposalsList, "ProposalsList").$$render(
        $$result,
        {
          repo_naddr_override: repo_naddr,
          proposals_or_issues: filtered,
          loading: $issue_summaries.loading
        },
        {},
        {}
      )}`}</div>`;
    }
  })}`;
});
export {
  Page as default
};
