import { c as create_ssr_component } from "./ssr.js";
const AlertError = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div role="alert" class="m-auto max-w-xl"><div role="alert" class="alert alert-error m-auto mt-6"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div>${slots.default ? slots.default({}) : ``}</div></div></div>`;
});
export {
  AlertError as A
};
