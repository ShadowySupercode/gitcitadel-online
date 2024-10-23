import { c as create_ssr_component, e as escape } from "./ssr.js";
const version = "v1.5.2";
const InstallNgit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "md" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  return `<div class="${["prose", size === "sm" ? "text-sm" : ""].join(" ").trim()}"><p data-svelte-h="svelte-2on22t">download binaries and add them to a directory from which they can be run
    globally:</p> <p><a href="${"https://github.com/DanConwayDev/ngit-cli/releases/download/" + escape(version, true) + "/ngit-" + escape(version, true) + "-x86_64-unknown-linux-gnu.tar.gz"}" class="${["btn btn-neutral", size === "sm" ? "btn-sm" : ""].join(" ").trim()}">Linux</a> <a href="${"https://github.com/DanConwayDev/ngit-cli/releases/download/" + escape(version, true) + "/ngit-" + escape(version, true) + "-aarch64-apple-darwin.tar.gz"}" class="${["btn btn-neutral", size === "sm" ? "btn-sm" : ""].join(" ").trim()}">Mac</a> <a href="${"https://github.com/DanConwayDev/ngit-cli/releases/download/" + escape(version, true) + "/ngit-" + escape(version, true) + "-x86_64-pc-windows-msvc.zip"}" class="${["btn btn-neutral", size === "sm" ? "btn-sm" : ""].join(" ").trim()}">Windows</a> ${escape(version)}</p> <p data-svelte-h="svelte-1sejcyj">alternatively, if you have cargo installed run<code>cargo install ngit</code></p></div>`;
});
export {
  InstallNgit as I
};
