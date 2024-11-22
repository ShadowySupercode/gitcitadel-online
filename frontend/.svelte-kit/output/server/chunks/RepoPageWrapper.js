import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from "./ssr.js";
import { e as ensureIssueSummaries, R as RepoHeader, a as RepoDetails_1 } from "./RepoHeader.js";
import { k as selected_repo_event, t as naddrToRepoA, u as ensureSelectedRepoCollection, y as naddrToPointer } from "./type.js";
import { C as Container } from "./Container.js";
import { e as ensureProposalSummaries } from "./UserHeader.js";
import { A as AlertError } from "./AlertError.js";
const RepoPageWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  let { repo_naddr = "" } = $$props;
  let { selected_tab = "about" } = $$props;
  let { with_side_bar = true } = $$props;
  let { show_details_on_mobile = false } = $$props;
  let invalid_naddr = false;
  let a = "";
  if ($$props.repo_naddr === void 0 && $$bindings.repo_naddr && repo_naddr !== void 0) $$bindings.repo_naddr(repo_naddr);
  if ($$props.selected_tab === void 0 && $$bindings.selected_tab && selected_tab !== void 0) $$bindings.selected_tab(selected_tab);
  if ($$props.with_side_bar === void 0 && $$bindings.with_side_bar && with_side_bar !== void 0) $$bindings.with_side_bar(with_side_bar);
  if ($$props.show_details_on_mobile === void 0 && $$bindings.show_details_on_mobile && show_details_on_mobile !== void 0) $$bindings.show_details_on_mobile(show_details_on_mobile);
  {
    {
      const a_result = naddrToRepoA(repo_naddr);
      if (a_result) {
        a = a_result;
        invalid_naddr = false;
        ensureSelectedRepoCollection(a, naddrToPointer(repo_naddr)?.relays);
        ensureProposalSummaries(a);
        ensureIssueSummaries(a);
      } else {
        invalid_naddr = true;
      }
    }
  }
  $$unsubscribe_selected_repo_event();
  return `${validate_component(RepoHeader, "RepoHeader").$$render($$result, Object.assign({}, $selected_repo_event, { selected_tab }), {}, {})} ${invalid_naddr ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
        default: () => {
          return `<div data-svelte-h="svelte-1tdr53x">Error! invalid naddr in url:</div> <div class="break-all">${escape(repo_naddr)}</div>`;
        }
      })}`;
    }
  })} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}` : ``} ${with_side_bar ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="mt-2 md:flex"><div class="md:mr-2 md:w-2/3">${slots.default ? slots.default({}) : ``}</div> <div class="${[
        "rounded-lg border border-base-400 md:flex md:w-1/3 md:border-none",
        !show_details_on_mobile ? "hidden" : ""
      ].join(" ").trim()}"><div class="border-b border-base-400 bg-base-300 px-6 py-3 md:hidden" data-svelte-h="svelte-1qcobrx"><h4 class="">Repository Details</h4></div> <div class="prose my-3 w-full px-6 md:ml-2 md:px-0">${validate_component(RepoDetails_1, "RepoDetails").$$render($$result, { a }, {}, {})}</div></div></div>`;
    }
  })}` : `${slots.default ? slots.default({}) : ``}`}`;
});
export {
  RepoPageWrapper as R
};
