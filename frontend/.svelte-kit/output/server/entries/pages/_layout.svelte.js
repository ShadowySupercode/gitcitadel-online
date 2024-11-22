import { c as create_ssr_component, v as validate_component, a as subscribe } from "../../chunks/ssr.js";
import { U as UserHeader, l as logged_in_user, n as nip07_plugin, a as login } from "../../chunks/UserHeader.js";
import { C as Container } from "../../chunks/Container.js";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { logged_in_user: logged_in_user2 = void 0 } = $$props;
  let { nip07_plugin: nip07_plugin2 = void 0 } = $$props;
  let { login_function = () => {
  } } = $$props;
  let { singup_function = () => {
  } } = $$props;
  if ($$props.logged_in_user === void 0 && $$bindings.logged_in_user && logged_in_user2 !== void 0) $$bindings.logged_in_user(logged_in_user2);
  if ($$props.nip07_plugin === void 0 && $$bindings.nip07_plugin && nip07_plugin2 !== void 0) $$bindings.nip07_plugin(nip07_plugin2);
  if ($$props.login_function === void 0 && $$bindings.login_function && login_function !== void 0) $$bindings.login_function(login_function);
  if ($$props.singup_function === void 0 && $$bindings.singup_function && singup_function !== void 0) $$bindings.singup_function(singup_function);
  return `<div class="bg-base-400">${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="navbar"><div class="navbar-start" data-svelte-h="svelte-1w4uugq"><a href="/repos" class="btn btn-ghost btn-sm normal-case">Repos</a></div> <div class="navbar-center" data-svelte-h="svelte-1ynvvnp"><a class="align-middle text-lg" href="/"><span class="text-purple-600">git</span><span class="text-white">workshop</span><span class="text-neutral">.dev</span></a></div> <div class="navbar-end gap-4">${logged_in_user2 ? `<div class="dropdown dropdown-end"><div tabindex="0" role="button" class="m-1">${validate_component(UserHeader, "UserHeader").$$render(
        $$result,
        {
          user: logged_in_user2,
          link_to_profile: false
        },
        {},
        {}
      )}</div>  <ul tabindex="0" class="menu dropdown-content z-[1] -mr-4 rounded-box bg-base-400 p-2 shadow"><li>${validate_component(UserHeader, "UserHeader").$$render($$result, { user: logged_in_user2 }, {}, {})}</li>   <li> <a data-svelte-h="svelte-1p51vov">Logout</a></li></ul></div>` : `${nip07_plugin2 === void 0 ? `<div class="skeleton h-8 w-20"></div>` : `${nip07_plugin2 ? `<button class="btn btn-ghost btn-sm normal-case" data-svelte-h="svelte-63mcpk">Login</button>` : `<button class="btn btn-ghost btn-sm normal-case" data-svelte-h="svelte-3rqyjq">Sign up</button>`}`}`}</div></div>`;
    }
  })}</div>`;
});
const Navbar_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  let $nip07_plugin, $$unsubscribe_nip07_plugin;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  $$unsubscribe_nip07_plugin = subscribe(nip07_plugin, (value) => $nip07_plugin = value);
  let singup_function = () => {
    alert("a NIP-07 browser extension is required. currently no signup page");
  };
  $$unsubscribe_logged_in_user();
  $$unsubscribe_nip07_plugin();
  return `${validate_component(Navbar, "Navbar").$$render(
    $$result,
    {
      logged_in_user: $logged_in_user,
      nip07_plugin: $nip07_plugin,
      login_function: login,
      singup_function
    },
    {},
    {}
  )}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Navbar_1, "Navbar").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``} <div class="h-10"></div>`;
});
export {
  Layout as default
};
