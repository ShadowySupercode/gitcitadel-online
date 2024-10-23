import { c as create_ssr_component } from "./ssr.js";
const Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { no_wrap = false } = $$props;
  if ($$props.no_wrap === void 0 && $$bindings.no_wrap && no_wrap !== void 0) $$bindings.no_wrap(no_wrap);
  return `<div class="mx-auto lg:container">${no_wrap ? `${slots.default ? slots.default({}) : ``}` : `<div class="px-3">${slots.default ? slots.default({}) : ``}</div>`}</div>`;
});
export {
  Container as C
};
