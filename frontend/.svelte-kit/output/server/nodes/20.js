

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/repos/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/20.CMsBp7Pq.js","_app/immutable/chunks/scheduler.DrQRk8ea.js","_app/immutable/chunks/index.CcdvbsEI.js","_app/immutable/chunks/Container.CWcU-xxO.js","_app/immutable/chunks/ReposSummaryList.DA-W97k9.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Issue.bBFUSQy9.js","_app/immutable/chunks/entry.vAbeKpqR.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/chunks/UserHeader.BDCIfTyX.js"];
export const stylesheets = ["_app/immutable/assets/ReposSummaryList.DGZAYqzJ.css","_app/immutable/assets/UserHeader.wercszHl.css"];
export const fonts = [];
