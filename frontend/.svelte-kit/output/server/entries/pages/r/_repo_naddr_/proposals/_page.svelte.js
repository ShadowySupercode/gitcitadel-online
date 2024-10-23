import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../../../chunks/ssr.js";
import { P as ProposalsList } from "../../../../../chunks/ProposalsList.js";
import { l as proposal_status_open, x as proposal_status_draft, m as proposal_status_applied, o as proposal_status_closed, k as selected_repo_event, q as statusKindtoText } from "../../../../../chunks/type.js";
import { p as proposal_summaries } from "../../../../../chunks/UserHeader.js";
import { R as RepoPageWrapper } from "../../../../../chunks/RepoPageWrapper.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $proposal_summaries, $$unsubscribe_proposal_summaries;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  $$unsubscribe_proposal_summaries = subscribe(proposal_summaries, (value) => $proposal_summaries = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  let status = proposal_status_open;
  let filtered = [];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  filtered = $proposal_summaries.summaries.filter((s) => s.status === status);
  $$unsubscribe_proposal_summaries();
  $$unsubscribe_selected_repo_event();
  return `${$$result.head += `<!-- HEAD_svelte-1aqixie_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)} - proposals</title>`, ""}<!-- HEAD_svelte-1aqixie_END -->`, ""} ${validate_component(RepoPageWrapper, "RepoPageWrapper").$$render($$result, { repo_naddr, selected_tab: "proposals" }, {}, {
    default: () => {
      return `<div class="mt-2 border border-base-400"><div class="flex bg-slate-900"><div class="tabs tabs-lifted tabs-xs flex-none p-2"><button role="tab" class="${[
        "tab",
        " font-bold"
      ].join(" ").trim()}">${escape($proposal_summaries.summaries.filter((s) => s.status === proposal_status_open).length)} Open</button> <button role="tab" class="${[
        "tab",
        "opacity-50 "
      ].join(" ").trim()}">${escape($proposal_summaries.summaries.filter((s) => s.status === proposal_status_draft).length)} Draft</button> <button role="tab" class="${[
        "tab",
        "opacity-50 "
      ].join(" ").trim()}">${escape($proposal_summaries.summaries.filter((s) => s.status === proposal_status_applied).length)} Merged</button> <button role="tab" class="${[
        "tab",
        "opacity-50 "
      ].join(" ").trim()}">${escape($proposal_summaries.summaries.filter((s) => s.status === proposal_status_closed).length)} Closed</button></div></div> ${filtered.length === 0 ? `<div class="py-10 text-center lowercase">can&#39;t find any ${escape(statusKindtoText(status, "proposal"))} proposals</div>` : `${validate_component(ProposalsList, "ProposalsList").$$render(
        $$result,
        {
          repo_naddr_override: repo_naddr,
          proposals_or_issues: filtered,
          loading: $proposal_summaries.loading
        },
        {},
        {}
      )}`}</div> <div role="alert" class="alert mt-6" data-svelte-h="svelte-1cmicki"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div><h3 class="prose mb-2 text-sm font-bold">want to submit a proposal?</h3> <p class="prose text-xs">1) <a href="/ngit">install ngit</a> 2) clone with the nostr url 3) push
        a new branch with the
        <span class="rounded bg-neutral p-1 font-mono"><span class="py-3">pr/</span></span> prefix</p></div></div>`;
    }
  })}`;
});
export {
  Page as default
};
