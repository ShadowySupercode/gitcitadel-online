import { c as create_ssr_component, v as validate_component, i as is_promise, n as noop } from "../../../chunks/ssr.js";
import { C as Container } from "../../../chunks/Container.js";
import { S as SvelteMarkdown } from "../../../chunks/SvelteMarkdown.js";
async function get_md() {
  const res = await fetch("/concept.md");
  return await res.text();
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-5r81g6_START -->${$$result.title = `<title>GitWorkshop: Concept</title>`, ""}<!-- HEAD_svelte-5r81g6_END -->`, ""} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${function(__value) {
        if (is_promise(__value)) {
          __value.then(null, noop);
          return ` <p data-svelte-h="svelte-qeejp2">loading...</p> `;
        }
        return function(md) {
          return ` <article class="prose prose-sm mt-3">${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render($$result, { options: { gfm: true }, source: md }, {}, {})}</article> `;
        }(__value);
      }(get_md())}`;
    }
  })}`;
});
export {
  Page as default
};
