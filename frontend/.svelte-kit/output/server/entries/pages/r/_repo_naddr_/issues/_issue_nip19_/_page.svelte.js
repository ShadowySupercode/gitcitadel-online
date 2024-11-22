import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../../../../chunks/ssr.js";
import { e as ensureIssueFull, s as selected_issue_full, b as selected_issue_replies } from "../../../../../../chunks/Issue.js";
import { P as ProposalHeader, T as Thread, a as ProposalDetails } from "../../../../../../chunks/ProposalDetails.js";
import { C as Container } from "../../../../../../chunks/Container.js";
import { R as RepoPageWrapper } from "../../../../../../chunks/RepoPageWrapper.js";
import { t as naddrToRepoA, w as neventOrNoteToHexId, k as selected_repo_event } from "../../../../../../chunks/type.js";
import { A as AlertError } from "../../../../../../chunks/AlertError.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_issue_full, $$unsubscribe_selected_issue_full;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  let $selected_issue_replies, $$unsubscribe_selected_issue_replies;
  $$unsubscribe_selected_issue_full = subscribe(selected_issue_full, (value) => $selected_issue_full = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  $$unsubscribe_selected_issue_replies = subscribe(selected_issue_replies, (value) => $selected_issue_replies = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  let a = "";
  let issue_nip19 = data.issue_nip19;
  let issue_id = "";
  let invalid_issue_ref = false;
  let issue_error = false;
  let waited_5_secs = false;
  setTimeout(
    () => {
      waited_5_secs = true;
    },
    5e3
  );
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      const a_result = naddrToRepoA(repo_naddr);
      if (a_result) a = a_result;
    }
  }
  {
    {
      const issue_nip19_result = neventOrNoteToHexId(issue_nip19);
      if (issue_nip19_result) {
        issue_id = issue_nip19_result;
        invalid_issue_ref = false;
        ensureIssueFull(a, issue_id);
      } else {
        invalid_issue_ref = true;
      }
    }
  }
  {
    {
      issue_error = !$selected_issue_full.summary.loading && $selected_issue_full.summary.created_at === 0;
    }
  }
  $$unsubscribe_selected_issue_full();
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_selected_issue_replies();
  return `${$$result.head += `<!-- HEAD_svelte-1an7jcg_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)} - ${escape($selected_issue_full.summary.title)}</title>`, ""}<!-- HEAD_svelte-1an7jcg_END -->`, ""} ${validate_component(RepoPageWrapper, "RepoPageWrapper").$$render(
    $$result,
    {
      repo_naddr,
      with_side_bar: false,
      selected_tab: "issues"
    },
    {},
    {
      default: () => {
        return `${invalid_issue_ref || waited_5_secs && issue_error ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
              default: () => {
                return `${invalid_issue_ref ? `<div>Error! invalid Issue reference: ${escape(issue_id)}</div> <div class="break-all">&#39;${escape(issue_nip19)}&#39;</div>` : `<div>Error! cannot find Issue ${escape("")}event</div>`}`;
              }
            })}`;
          }
        })}` : `${validate_component(ProposalHeader, "ProposalHeader").$$render($$result, Object.assign({}, $selected_issue_full.summary), {}, {})} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="mx-auto max-w-6xl lg:flex"><div class="md:mr-2 lg:w-2/3"><div class="max-w-4xl">${$selected_issue_full.issue_event ? `${validate_component(Thread, "Thread").$$render(
              $$result,
              {
                type: "issue",
                event: $selected_issue_full.issue_event,
                replies: $selected_issue_replies
              },
              {},
              {}
            )}` : ``}</div></div> <div class="prose ml-2 hidden w-1/3 lg:flex">${validate_component(ProposalDetails, "ProposalDetails").$$render(
              $$result,
              {
                type: "issue",
                summary: $selected_issue_full.summary,
                labels: $selected_issue_full.labels,
                loading: $selected_issue_full.loading
              },
              {},
              {}
            )}</div></div>`;
          }
        })}`}`;
      }
    }
  )}`;
});
export {
  Page as default
};
