import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { C as Container } from "../../chunks/Container.js";
import { I as InstallNgit } from "../../chunks/InstallNgit.js";
import { R as ReposSummaryList } from "../../chunks/ReposSummaryList.js";
import { P as ProposalsList } from "../../chunks/ProposalsList.js";
import { e as ensureRepo, r as repoEventToSummary, s as summary_defaults, a as repo_kind } from "../../chunks/type.js";
import { e as ensureProposalSummaries, p as proposal_summaries } from "../../chunks/UserHeader.js";
import { w as writable } from "../../chunks/index2.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $example_repos, $$unsubscribe_example_repos;
  let $proposal_summaries, $$unsubscribe_proposal_summaries;
  $$unsubscribe_proposal_summaries = subscribe(proposal_summaries, (value) => $proposal_summaries = value);
  ensureProposalSummaries(void 0);
  let example_repos = writable([]);
  $$unsubscribe_example_repos = subscribe(example_repos, (value) => $example_repos = value);
  const updateRepos = (r) => {
    example_repos.update((repos) => {
      return [
        ...repos.filter((s) => s.identifier.length > 0 && s.identifier !== r.identifier),
        repoEventToSummary(r) || { ...summary_defaults }
      ].sort();
    });
  };
  ensureRepo(`${repo_kind}:a008def15796fba9a0d6fab04e8fd57089285d9fd505da5a83fe8aad57a3564d:ngit`).subscribe(updateRepos);
  ensureRepo(`${repo_kind}:a008def15796fba9a0d6fab04e8fd57089285d9fd505da5a83fe8aad57a3564d:gitworkshop`).subscribe(updateRepos);
  $$unsubscribe_example_repos();
  $$unsubscribe_proposal_summaries();
  return `${$$result.head += `<!-- HEAD_svelte-1nweh65_START -->${$$result.title = `<title>gitworkshop.dev</title>`, ""}<!-- HEAD_svelte-1nweh65_END -->`, ""} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div data-svelte-h="svelte-p1otgn"><div class="m-auto mt-5 max-w-lg text-center"><div class="prose"><h1 class="mb-2"><span class="text-purple-600">git</span><span class="text-white">workshop</span><span class="text-neutral">.dev</span></h1> <p class="mb-8 mt-3">a decentralized git workflow on nostr for freedom lovers</p></div></div></div>`;
    }
  })} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="m-auto max-w-5xl" data-svelte-h="svelte-1caf1oh"><div class="grid gap-4 md:grid-cols-6"><div class=""></div> <div class="card col-span-2 bg-base-300"><div class="card-body"><div class="card-title"><h3>nostr</h3></div> <div class="prose">An open protocol that is able to create a censorship resistant
            global &quot;social&quot; network once and for all</div></div></div> <div class="card col-span-2 bg-base-300"><div class="card-body"><div class="card-title"><h3>any <span class="text-yellow-600">git</span> server</h3></div> <div class="prose">used only for syncing data eg. Gitea, Github, Gitlab, self-hosted...</div></div></div></div> <div class="hidden md:block"><div class="grid h-5 grid-cols-6 gap-0"><div class=""></div> <div class=""></div> <div class="border-b border-l"></div> <div class="border-b"></div> <div class="border-l"></div></div> <div class="grid h-5 grid-cols-2 gap-0"><div class=""></div> <div class="border-l"></div></div> <div class="grid h-5 grid-cols-6 gap-0"><div class=""></div> <div class="border-l border-t"></div> <div class="border-t"></div> <div class="border-l border-t"></div> <div class="border-r border-t"></div></div></div> <div class="divider md:hidden"></div> <div class="grid gap-4 md:grid-cols-3"><div class="card bg-base-300"><div class="card-body"><div class="card-title"><h3><span class="text-purple-600">git</span>workshop<span class="text-neutral">.dev</span></h3></div> <div class="prose">A nostr web client to manage and discuss issues and code proposals</div></div></div> <div class="card bg-base-300"><div class="card-body"><div class="card-title"><h3><span class="text-yellow-600">git</span>-remote-nostr</h3></div> <div class="prose">git remote helper (plugin) for seemless nostr integration</div></div></div> <div class="card bg-base-300"><div class="card-body"><div class="card-title"><h3><span class="text-purple-600">n</span>git</h3></div> <div class="prose">a command line tool to manage repos and advanced patch
            submission / review</div></div></div></div></div>`;
    }
  })} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="prose m-auto mb-6 mt-6" data-svelte-h="svelte-g3c8x5"><h2>How it works</h2> <p>Git is a decentralized version control system, yet most freedom tech
      projects use centralized walled gardens on top of git as a social and
      collaboration layer for code changes.</p> <p>Gitworkshop.dev, git-remote-nostr and ngit are tools to enable code
      collaboration over nostr. Gitworkshop.dev provides a visual interface to
      discuss proposals and open issues. git-remote-nostr enables proposal
      creation, review and incorporation using standard git tooling. ngit
      handles repository setup and advanced proposal submission.</p> <div class="flex justify-end"><a href="/about" class="btn btn-secondary text-right">details</a></div></div>`;
    }
  })} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="prose m-auto mb-6 mt-6"><h2 data-svelte-h="svelte-7tv6tr">Quick Start</h2> <h3 data-svelte-h="svelte-1qhtrvy">Install ngit and git-remote-nostr</h3> ${validate_component(InstallNgit, "InstallNgit").$$render($$result, {}, {}, {})}</div> <div class="m-auto max-w-5xl" data-svelte-h="svelte-nu5faz"><div class="grid gap-4 md:grid-cols-2"><div class="card bg-base-200"><div class="card-body"><div class="card-title"><h3>for the contributor</h3></div> <p>clone the nostr url and use normal git operations with tool you are
            used it (eg. your IDE)</p> <div class="text-sm"><div><code><span class="text-yellow-600">git</span> clone nostr://<span class="text-purple-600">npub123</span>/<span class="text-primary">repo-identifier</span></code></div> <div><code><span class="text-green-600">// use pr/ branch prefix to create a nostr proposal</span></code></div> <div><code><span class="text-yellow-600">git</span> checkout -b pr/great-feature</code></div> <div><code><span class="text-yellow-600">git</span> commit -am &quot;improve the
                world&quot;</code></div> <div><code><span class="text-yellow-600">git</span> push -u</code></div> <div><code><span class="text-green-600">// any branch with pr/ prefix is nostr proposal</span></code></div> <div><code><span class="text-yellow-600">git</span> branch -r --list origin/pr/*</code></div></div> <div class="card-actions mt-auto justify-end"><a href="/quick-start#contributor" class="btn btn-secondary text-right">full guide</a></div></div></div> <div class="card bg-base-200"><div class="card-body"><div class="card-title"><h3>for the maintainer</h3></div> <div class="text-sm"><div class="not-prose text-sm"><div><code><span class="text-green-600">// create a git repo and push to a git server</span></code></div> <div><code><span class="text-yellow-600">git</span> init</code></div> <div><code><span class="text-yellow-600">git</span> commit -am &quot;initial commit&quot;</code></div> <div><code><span class="text-yellow-600">git</span> remote add origin https://dm.co/usr/my-repo</code></div> <div><code><span class="text-yellow-600">git</span> push -u origin master</code></div> <div><code><span class="text-green-600">// announce on nostr</span></code></div> <div><div><code><span class="text-purple-600">ngit</span> init --identifier
                    <span class="text-primary">my-repo</span></code></div> <div><code><span class="text-green-600">// push to nostr and git server(s) via remote helper</span></code></div> <div><div><code><span class="text-yellow-600">git</span> remote set-url
                      origin nostr://<span class="text-purple-600">npub123</span>/<span class="text-primary">my-repo</span></code></div> <div><code><span class="text-green-600">// pushing merged commits updates proposal status</span></code></div> <div><code><span class="text-yellow-600">git</span> merge origin/pr/great-feature(e8246b2)</code></div> <div><code><span class="text-yellow-600">git</span> push</code></div></div></div></div> <div class="card-actions mt-auto justify-end"><a href="/quick-start#maintainer" class="btn btn-secondary text-right">full guide</a></div></div></div></div></div></div>`;
    }
  })} ${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="prose m-auto mb-6 mt-6"><h2 data-svelte-h="svelte-1p2515g">Example Repositories</h2> <p data-svelte-h="svelte-1izqs9g">These repositories have plenty of issues and proposals to explore</p> <div class="not-prose lg:w-[64rem]">${validate_component(ReposSummaryList, "ReposSummaryList").$$render($$result, { repos: $example_repos, loading: false }, {}, {})}</div> <a href="/repos" class="btn btn-primary mt-9" data-svelte-h="svelte-1lht0qc">List More Repositories</a> <h2 data-svelte-h="svelte-er35vm">Recent Proposals</h2> <div class="not-prose mt-6">${validate_component(ProposalsList, "ProposalsList").$$render(
        $$result,
        {
          proposals_or_issues: $proposal_summaries.summaries,
          show_repo: true,
          loading: $proposal_summaries.loading,
          limit: 6,
          allow_more: true
        },
        {},
        {}
      )}</div></div>`;
    }
  })}`;
});
export {
  Page as default
};
