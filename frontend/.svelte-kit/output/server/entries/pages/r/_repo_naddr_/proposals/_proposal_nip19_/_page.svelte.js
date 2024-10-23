import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../../../../chunks/ssr.js";
import { a as ensureProposalFull, c as selected_proposal_full, d as selected_proposal_replies } from "../../../../../../chunks/Issue.js";
import { P as ProposalHeader, T as Thread, a as ProposalDetails } from "../../../../../../chunks/ProposalDetails.js";
import { C as Container } from "../../../../../../chunks/Container.js";
import { R as RepoPageWrapper } from "../../../../../../chunks/RepoPageWrapper.js";
import { t as naddrToRepoA, w as neventOrNoteToHexId, k as selected_repo_event } from "../../../../../../chunks/type.js";
import { A as AlertError } from "../../../../../../chunks/AlertError.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_proposal_full, $$unsubscribe_selected_proposal_full;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  let $selected_proposal_replies, $$unsubscribe_selected_proposal_replies;
  $$unsubscribe_selected_proposal_full = subscribe(selected_proposal_full, (value) => $selected_proposal_full = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  $$unsubscribe_selected_proposal_replies = subscribe(selected_proposal_replies, (value) => $selected_proposal_replies = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  let a = "";
  let proposal_nip19 = data.proposal_nip19;
  let proposal_id = "";
  let invalid_proposal_ref = false;
  let proposal_error = false;
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
      const proposal_nip19_result = neventOrNoteToHexId(proposal_nip19);
      if (proposal_nip19_result) {
        proposal_id = proposal_nip19_result;
        invalid_proposal_ref = false;
        ensureProposalFull(a, proposal_id);
      } else {
        invalid_proposal_ref = true;
      }
    }
  }
  {
    {
      proposal_error = !$selected_proposal_full.summary.loading && $selected_proposal_full.summary.created_at === 0;
    }
  }
  $$unsubscribe_selected_proposal_full();
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_selected_proposal_replies();
  return `${$$result.head += `<!-- HEAD_svelte-1o657h1_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)} - ${escape($selected_proposal_full.summary.title)}</title>`, ""}<!-- HEAD_svelte-1o657h1_END -->`, ""} ${validate_component(RepoPageWrapper, "RepoPageWrapper").$$render(
    $$result,
    {
      repo_naddr,
      with_side_bar: false,
      selected_tab: "proposals"
    },
    {},
    {
      default: () => {
        return `${invalid_proposal_ref || waited_5_secs && proposal_error ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
              default: () => {
                return `${invalid_proposal_ref ? `<div>Error! invalid Issue reference: ${escape(proposal_id)}</div> <div class="break-all">&#39;${escape(proposal_nip19)}&#39;</div>` : `<div>Error! cannot find Issue ${escape("")}event</div>`}`;
              }
            })}`;
          }
        })}` : `${validate_component(ProposalHeader, "ProposalHeader").$$render($$result, Object.assign({}, $selected_proposal_full.summary), {}, {})} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="mx-auto max-w-6xl lg:flex"><div class="md:mr-2 lg:w-2/3"><div class="max-w-4xl">${$selected_proposal_full.proposal_event ? `${validate_component(Thread, "Thread").$$render(
              $$result,
              {
                type: "proposal",
                event: $selected_proposal_full.proposal_event,
                replies: $selected_proposal_replies
              },
              {},
              {}
            )}` : ``}</div></div> <div class="prose ml-2 hidden w-1/3 lg:flex">${validate_component(ProposalDetails, "ProposalDetails").$$render(
              $$result,
              {
                type: "proposal",
                summary: $selected_proposal_full.summary,
                labels: $selected_proposal_full.labels,
                loading: $selected_proposal_full.loading
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
