import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { C as Container } from "../../../chunks/Container.js";
import { I as InstallNgit } from "../../../chunks/InstallNgit.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-bs2zwp_START -->${$$result.title = `<title>GitWorkshop - ngit</title>`, ""}<!-- HEAD_svelte-bs2zwp_END -->`, ""} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="prose m-auto mt-8"><h2 class="" data-svelte-h="svelte-dkfzcm"><span class="text-purple-600">n</span>git</h2> <p data-svelte-h="svelte-cckjpr">a command-line tool to send and review patches via nostr</p> <ul data-svelte-h="svelte-1lxdbop"><li>works seemlessly with <a href="https://gitworkshop.dev">gitworkshop.dev</a></li> <li>fully compatable with nip34</li> <li>enables proposals to be managed as branches, similar to GitHub PRs via
        optional nip34</li></ul> <p data-svelte-h="svelte-9sslu7">ngit and gitworkshop.dev are new, experimental and in an alpha state.</p> <div role="alert" class="alert my-3" data-svelte-h="svelte-1w4pha8"> <svg class="h-5 w-5 shrink-0 stroke-current" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m235.32 180l-36.24-36.25l-36.46-120.29A21.76 21.76 0 0 0 128 12.93a21.76 21.76 0 0 0-34.62 10.53l-36.46 120.3L20.68 180a16 16 0 0 0 0 22.62l32.69 32.69a16 16 0 0 0 22.63 0L124.28 187a40.68 40.68 0 0 0 3.72-4.29a40.68 40.68 0 0 0 3.72 4.29L180 235.32a16 16 0 0 0 22.63 0l32.69-32.69a16 16 0 0 0 0-22.63M120 158.75a23.85 23.85 0 0 1-7 17L88.68 200L56 167.32l13.65-13.66a8 8 0 0 0 2-3.34l37-122.22A5.78 5.78 0 0 1 120 29.78Zm47.44 41.38L143 175.72a23.85 23.85 0 0 1-7-17v-129a5.78 5.78 0 0 1 11.31-1.68l37 122.22a8 8 0 0 0 2 3.34l14.49 14.49Z"></path></svg> <div><h4 class="my-1 font-bold">please provide feedback</h4> <p class="mb-0 text-sm">via an <a class="link-secondary" href="/r/naddr1qqzxuemfwsqs6amnwvaz7tmwdaejumr0dspzpgqgmmc409hm4xsdd74sf68a2uyf9pwel4g9mfdg8l5244t6x4jdqvzqqqrhnym0k2qj">ngit issue</a>, a
          <a class="link-secondary" href="/r/naddr1qq9kw6t5wahhy6mndphhqqgkwaehxw309aex2mrp0yhxummnw3ezucnpdejqyg9qpr00z4uklw56p4h6kp8gl4ts3y59m874qhd94ql732k40g6kf5psgqqqw7vs2nfsd9">gitworkshop.dev issue</a>
          or directly to
          <a class="link-primary" href="/p/nprofile1qy88wumn8ghj7mn0wvhxcmmv9uq3vamnwvaz7tmsw4e8qmr9wfjkccte9e3k7mf0qqs2qzx779ted7af5rt04vzw3l2hpzfgtk0a2pw6t2plaz4d2734vng80y96x">DanConwayDev</a> on nostr</p> <p class="mt-1 text-sm">your feedback makes them better</p></div></div> <h3 data-svelte-h="svelte-1tlikxz">Install</h3> ${validate_component(InstallNgit, "InstallNgit").$$render($$result, {}, {}, {})} <h3 data-svelte-h="svelte-1p7fh5u">Commands</h3> <p data-svelte-h="svelte-12ecyuw">run from the your product&#39;s git repository:</p> <p data-svelte-h="svelte-1dbz51f"><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit init</span></span>
      signal you are this repo&#39;s maintainer accepting proposals via nostr</p> <p data-svelte-h="svelte-1ojtvdn"><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit send</span></span>
      issue commits as a proposal</p> <p data-svelte-h="svelte-11wlbn9"><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit list</span></span>
      list proposals; checkout, apply or donwload selected</p> <p data-svelte-h="svelte-ir9sxz">and when on a proposal branch:</p> <p data-svelte-h="svelte-1466djq"><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit push</span></span>
      send proposal revision</p> <p data-svelte-h="svelte-fe5nao"><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit pull</span></span>
      fetch and apply new proposal commits / revisions linked to branch</p> <h3 data-svelte-h="svelte-1cxbenc">Protocol</h3> <p data-svelte-h="svelte-cwvalg"><a href="/about">nip34</a> is a nostr protocol for sending git patches over
      nostr, similar to how patches are sent via email which is a model used extensively
      including in very large project such as the linux kernel</p> <p data-svelte-h="svelte-16e5a2v">ngit supports optional nip34 features to enable:</p> <ul data-svelte-h="svelte-1px7s9e"><li>patches managed as branches, similar to GitHub PRs
        <ul><li>maintain commit ids, pgp signed commits, enabling merge with commits
            pgp signed by the author, amend commits</li></ul></li> <li>multiple maintainers for a repository and a pathway to smoothly
        transition maintainership when a maintainer moves on</li> <li>ensure that user who have already cloned the repository dont get scammed
        by someone else issuing a repository event, pretending to be the
        maintainer, and directing users to a malicious git server
        <ul><li><span class="rounded bg-neutral p-2 font-mono"><span class="py-5">ngit init</span></span>
            creates an optional
            <span class="bg-base-200 p-2 font-mono">maintainers.yaml</span> file
            in the root of your repo that lists the authorised maintainers and desired
            relays.</li></ul></li></ul> <p data-svelte-h="svelte-1cqn9ql"><a class="btn" href="/about">learn more</a></p></div>`;
    }
  })}`;
});
export {
  Page as default
};
