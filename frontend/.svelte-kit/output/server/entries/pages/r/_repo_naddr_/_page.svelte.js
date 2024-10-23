import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
import { j as selected_repo_readme, k as selected_repo_event } from "../../../../chunks/type.js";
import { S as SvelteMarkdown } from "../../../../chunks/SvelteMarkdown.js";
import { R as RepoPageWrapper } from "../../../../chunks/RepoPageWrapper.js";
import { g as goto } from "../../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_repo_readme, $$unsubscribe_selected_repo_readme;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  $$unsubscribe_selected_repo_readme = subscribe(selected_repo_readme, (value) => $selected_repo_readme = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      if ($selected_repo_readme.failed === true) goto();
    }
  }
  $$unsubscribe_selected_repo_readme();
  $$unsubscribe_selected_repo_event();
  return `${$$result.head += `<!-- HEAD_svelte-1cmxak6_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)}</title>`, ""}<!-- HEAD_svelte-1cmxak6_END -->`, ""} ${validate_component(RepoPageWrapper, "RepoPageWrapper").$$render(
    $$result,
    {
      repo_naddr,
      selected_tab: "about",
      show_details_on_mobile: true
    },
    {},
    {
      default: () => {
        return `<div class="my-3 rounded-lg border border-base-400"><div class="border-b border-base-400 bg-base-300 px-6 py-3" data-svelte-h="svelte-12st2tp"><h4 class="">README.md</h4></div> <div class="p-6">${$selected_repo_readme.loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div> <div class="skeleton my-3 h-5 w-20"></div> <div class="skeleton my-2 h-4"></div> <div class="skeleton my-2 mb-3 h-4 w-2/3"></div>` : `${$selected_repo_readme.failed ? `<div data-svelte-h="svelte-w6ihvt">failed to load readme from git server...</div>` : `<article class="prose prose-sm">${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render(
          $$result,
          {
            options: { gfm: true },
            source: $selected_repo_readme.md
          },
          {},
          {}
        )}</article>`}`}</div></div>`;
      }
    }
  )}`;
});
export {
  Page as default
};
