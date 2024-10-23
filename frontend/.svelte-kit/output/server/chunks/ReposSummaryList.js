import { c as create_ssr_component, h as add_attribute, e as escape, v as validate_component, f as each } from "./ssr.js";
import { s as summary_defaults } from "./type.js";
import { U as UserHeader } from "./UserHeader.js";
const css = {
  code: ".reposummarycard.svelte-je9lvi li.svelte-je9lvi::before{content:', '}.reposummarycard.svelte-je9lvi li.svelte-je9lvi:last-child::before{content:' and '}.reposummarycard.svelte-je9lvi li.svelte-je9lvi:first-child::before{content:''}",
  map: `{"version":3,"file":"RepoSummaryCard.svelte","sources":["RepoSummaryCard.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { summary_defaults } from \\"./repo/type\\";\\nimport UserHeader from \\"./users/UserHeader.svelte\\";\\nexport let { name, description, identifier, maintainers, naddr, loading } = summary_defaults;\\nlet short_name;\\n$: {\\n  if (name && name.length > 45) short_name = name.slice(0, 45) + \\"...\\";\\n  else if (name && name.length >= 0) short_name = name;\\n  else if (identifier && identifier.length > 45)\\n    short_name = identifier.slice(0, 45) + \\"...\\";\\n  else if (identifier && identifier.length >= 0) short_name = identifier;\\n  else short_name = \\"Untitled\\";\\n}\\nlet additional_maintainers = [];\\nlet author = void 0;\\n$: short_descrption = description.length > 50 ? description.slice(0, 45) + \\"...\\" : description;\\n$: {\\n  additional_maintainers = (([_, ...xs]) => xs)(maintainers);\\n  author = maintainers[0];\\n}\\n<\/script>\\r\\n\\r\\n<div\\r\\n  class=\\"rounded-lg bg-base-200 p-4\\"\\r\\n  style={\`min-height: \${maintainers.length * 1.325 + 2}rem;\`}\\r\\n>\\r\\n  {#if loading}\\r\\n    <div class=\\"skeleton mb-2 h-5 w-40\\"></div>\\r\\n    <div class=\\"w-100 skeleton h-4\\"></div>\\r\\n  {:else}\\r\\n    <a class=\\"link-primary break-words\\" href=\\"/r/{naddr}\\">{short_name}</a>\\r\\n    {#if short_descrption.length > 0}\\r\\n      <p class=\\"text-muted break-words pb-1 text-sm\\">\\r\\n        {short_descrption}\\r\\n      </p>\\r\\n    {/if}\\r\\n\\r\\n    <div class=\\"break-words text-right text-xs text-slate-400\\">\\r\\n      {#if author}\\r\\n        <div\\r\\n          class=\\"inline\\"\\r\\n          class:p-1={additional_maintainers.length > 0}\\r\\n          class:rounded-md={additional_maintainers.length > 0}\\r\\n          class:bg-base-400={additional_maintainers.length > 0}\\r\\n          class:text-white={additional_maintainers.length > 0}\\r\\n        >\\r\\n          <UserHeader user={author} inline={true} size=\\"xs\\" />\\r\\n        </div>\\r\\n        {#if additional_maintainers.length > 0}\\r\\n          <span>with</span>\\r\\n\\r\\n          <ul class=\\"reposummarycard inline\\">\\r\\n            {#each additional_maintainers as user}\\r\\n              <li class=\\"inline\\">\\r\\n                <UserHeader {user} inline={true} size=\\"xs\\" />\\r\\n              </li>\\r\\n            {/each}\\r\\n          </ul>\\r\\n        {/if}\\r\\n      {/if}\\r\\n    </div>\\r\\n  {/if}\\r\\n</div>\\r\\n\\r\\n<style lang=\\"postcss\\">\\r\\n  .reposummarycard li::before {\\r\\n    content: ', ';\\r\\n  }\\r\\n  .reposummarycard li:last-child::before {\\r\\n    content: ' and ';\\r\\n  }\\r\\n  .reposummarycard li:first-child::before {\\r\\n    content: '';\\r\\n  }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAgEE,8BAAgB,CAAC,gBAAE,QAAS,CAC1B,OAAO,CAAE,IACX,CACA,8BAAgB,CAAC,gBAAE,WAAW,QAAS,CACrC,OAAO,CAAE,OACX,CACA,8BAAgB,CAAC,gBAAE,YAAY,QAAS,CACtC,OAAO,CAAE,EACX"}`
};
const RepoSummaryCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let short_descrption;
  let { name: name_1, description: description_1, identifier: identifier_1, maintainers: maintainers_1, naddr: naddr_1, loading: loading_1 } = summary_defaults;
  let { name = name_1, description = description_1, identifier = identifier_1, maintainers = maintainers_1, naddr = naddr_1, loading = loading_1 } = $$props;
  let short_name;
  let additional_maintainers = [];
  let author = void 0;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.identifier === void 0 && $$bindings.identifier && identifier !== void 0) $$bindings.identifier(identifier);
  if ($$props.maintainers === void 0 && $$bindings.maintainers && maintainers !== void 0) $$bindings.maintainers(maintainers);
  if ($$props.naddr === void 0 && $$bindings.naddr && naddr !== void 0) $$bindings.naddr(naddr);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  $$result.css.add(css);
  {
    {
      if (name && name.length > 45) short_name = name.slice(0, 45) + "...";
      else if (name && name.length >= 0) short_name = name;
      else if (identifier && identifier.length > 45) short_name = identifier.slice(0, 45) + "...";
      else if (identifier && identifier.length >= 0) short_name = identifier;
      else short_name = "Untitled";
    }
  }
  short_descrption = description.length > 50 ? description.slice(0, 45) + "..." : description;
  {
    {
      additional_maintainers = (([_, ...xs]) => xs)(maintainers);
      author = maintainers[0];
    }
  }
  return `<div class="rounded-lg bg-base-200 p-4"${add_attribute("style", `min-height: ${maintainers.length * 1.325 + 2}rem;`, 0)}>${loading ? `<div class="skeleton mb-2 h-5 w-40"></div> <div class="w-100 skeleton h-4"></div>` : `<a class="link-primary break-words" href="${"/r/" + escape(naddr, true)}">${escape(short_name)}</a> ${short_descrption.length > 0 ? `<p class="text-muted break-words pb-1 text-sm">${escape(short_descrption)}</p>` : ``} <div class="break-words text-right text-xs text-slate-400">${author ? `<div class="${[
    "inline",
    (additional_maintainers.length > 0 ? "p-1" : "") + " " + (additional_maintainers.length > 0 ? "rounded-md" : "") + " " + (additional_maintainers.length > 0 ? "bg-base-400" : "") + " " + (additional_maintainers.length > 0 ? "text-white" : "")
  ].join(" ").trim()}">${validate_component(UserHeader, "UserHeader").$$render($$result, { user: author, inline: true, size: "xs" }, {}, {})}</div> ${additional_maintainers.length > 0 ? `<span data-svelte-h="svelte-1arlpha">with</span> <ul class="reposummarycard inline svelte-je9lvi">${each(additional_maintainers, (user) => {
    return `<li class="inline svelte-je9lvi">${validate_component(UserHeader, "UserHeader").$$render($$result, { user, inline: true, size: "xs" }, {}, {})} </li>`;
  })}</ul>` : ``}` : ``}</div>`} </div>`;
});
const ReposSummaryList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { repos = [] } = $$props;
  let { loading = false } = $$props;
  let { group_by = void 0 } = $$props;
  let grouped_repos = [];
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.repos === void 0 && $$bindings.repos && repos !== void 0) $$bindings.repos(repos);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  if ($$props.group_by === void 0 && $$bindings.group_by && group_by !== void 0) $$bindings.group_by(group_by);
  {
    {
      grouped_repos = [];
      repos.forEach((collection) => {
        if (!group_by) {
          grouped_repos.push([collection]);
          return;
        }
        const added_to_group = grouped_repos.some((group, i) => {
          if (group.some((c) => c[group_by] === collection[group_by])) {
            grouped_repos[i].push(collection);
            return true;
          }
          return false;
        });
        if (!added_to_group) grouped_repos.push([collection]);
      });
    }
  }
  return `<div class="min-width">${title.length > 0 ? `<div class="prose mb-3"><h3>${escape(title)}</h3></div>` : ``} ${repos.length == 0 && !loading ? `<p class="prose" data-svelte-h="svelte-1tqibyu">None</p>` : `<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">${each(grouped_repos, (group) => {
    return `${group.length === 0 ? `${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render($$result, { loading: true }, {}, {})}` : `${group.length === 1 ? `${each(group, ({ name, description, identifier, maintainers, naddr }) => {
      return `${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render(
        $$result,
        {
          name,
          description,
          identifier,
          maintainers,
          naddr
        },
        {},
        {}
      )}`;
    })}` : `${group_by ? `<div class="stack">  <div class="flex min-h-28 cursor-pointer items-center rounded-lg border border-base-400 bg-base-200 p-4 hover:bg-base-300"><div class="m-auto text-center"><div class="">${escape(group[0][group_by])}</div> <div class="text-sm opacity-50">${escape(group.length)} Items</div> </div></div> ${each(group, ({ name, description, identifier, maintainers, naddr }) => {
      return `<div class="rounded-lg border border-base-400">${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render(
        $$result,
        {
          name,
          description,
          identifier,
          maintainers,
          naddr
        },
        {},
        {}
      )} </div>`;
    })} </div>` : ``}`}`}`;
  })} ${loading ? `${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render($$result, { loading: true }, {}, {})} ${repos.length == 0 ? `${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render($$result, { loading: true }, {}, {})} ${validate_component(RepoSummaryCard, "RepoSummaryCard").$$render($$result, { loading: true }, {}, {})}` : ``}` : ``}</div>`}</div> ${``}`;
});
export {
  ReposSummaryList as R
};
