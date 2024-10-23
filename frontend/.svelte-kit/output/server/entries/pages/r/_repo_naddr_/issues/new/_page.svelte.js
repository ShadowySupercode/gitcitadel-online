import { c as create_ssr_component, a as subscribe, h as add_attribute, e as escape, v as validate_component } from "../../../../../../chunks/ssr.js";
import { R as RepoHeader, a as RepoDetails_1 } from "../../../../../../chunks/RepoHeader.js";
import { t as naddrToRepoA, u as ensureSelectedRepoCollection, k as selected_repo_event, v as selected_repo_collection } from "../../../../../../chunks/type.js";
import { C as Container } from "../../../../../../chunks/Container.js";
import "@nostr-dev-kit/ndk";
import { l as logged_in_user } from "../../../../../../chunks/UserHeader.js";
import "../../../../../../chunks/client.js";
import { A as AlertError } from "../../../../../../chunks/AlertError.js";
const ComposeIssue = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  let { repo_event } = $$props;
  let submitted = false;
  let edit_mode = false;
  let title = "";
  if ($$props.repo_event === void 0 && $$bindings.repo_event && repo_event !== void 0) $$bindings.repo_event(repo_event);
  {
    {
      edit_mode = !submitted;
    }
  }
  $$unsubscribe_logged_in_user();
  return `${edit_mode ? `<div class="flex"><div class="flex-grow"><label class="form-control w-full"><div class="label" data-svelte-h="svelte-245z59"><span class="label-text text-sm">Title</span></div> <input type="text" class="${[
    "input-neutral input input-sm input-bordered mb-3 w-full border-warning",
    ""
  ].join(" ").trim()}" placeholder="title"${add_attribute("value", title, 0)}> ${``}</label> <label class="form-control w-full"><div class="label" data-svelte-h="svelte-1j073h6"><span class="label-textarea text-sm">Description</span></div> <textarea ${""} class="textarea textarea-secondary w-full" placeholder="description" rows="10">${escape("")}</textarea></label> <div class="mt-2 flex items-center"><div class="flex-auto"></div> ${``} <button ${""} class="btn btn-primary btn-sm">${`${!$logged_in_user ? `Login before Sending` : `Send`}`}</button></div></div></div>` : ``} ${``}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  let $selected_repo_collection, $$unsubscribe_selected_repo_collection;
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  $$unsubscribe_selected_repo_collection = subscribe(selected_repo_collection, (value) => $selected_repo_collection = value);
  let { data } = $$props;
  let repo_naddr = data.repo_naddr;
  let invalid_naddr = false;
  let a = "";
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
      if (a_result) {
        a = a_result;
        invalid_naddr = false;
        ensureSelectedRepoCollection(a);
      } else {
        invalid_naddr = true;
      }
    }
  }
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_selected_repo_collection();
  return `${$$result.head += `<!-- HEAD_svelte-8ie5fc_START -->${$$result.title = `<title>GitWorkshop: ${escape($selected_repo_event.name)} - new issue</title>`, ""}<!-- HEAD_svelte-8ie5fc_END -->`, ""} ${invalid_naddr || waited_5_secs && $selected_repo_collection.loading && $selected_repo_event.name.length ? `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(AlertError, "AlertError").$$render($$result, {}, {}, {
        default: () => {
          return `${invalid_naddr ? `<div data-svelte-h="svelte-1tdr53x">Error! invalid naddr in url:</div> <div class="break-all">${escape(repo_naddr)}</div>` : `<div data-svelte-h="svelte-xcgkfj">Error! cannot find repository event:</div> <div class="break-all">${escape(repo_naddr)}</div>`}`;
        }
      })}`;
    }
  })}` : `${validate_component(RepoHeader, "RepoHeader").$$render($$result, Object.assign({}, $selected_repo_event), {}, {})} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="mt-2 lg:flex"><div class="prose lg:mr-2 lg:w-2/3"><h4 data-svelte-h="svelte-1bddlnl">Create Issue</h4> ${validate_component(ComposeIssue, "ComposeIssue").$$render($$result, { repo_event: $selected_repo_event }, {}, {})}</div> <div class="prose ml-2 hidden w-1/3 lg:flex">${validate_component(RepoDetails_1, "RepoDetails").$$render($$result, { a }, {}, {})}</div></div>`;
    }
  })}`}`;
});
export {
  Page as default
};
