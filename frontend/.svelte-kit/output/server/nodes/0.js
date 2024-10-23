import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BK0yoPin.js","_app/immutable/chunks/scheduler.DrQRk8ea.js","_app/immutable/chunks/index.CcdvbsEI.js","_app/immutable/chunks/UserHeader.BDCIfTyX.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Issue.bBFUSQy9.js","_app/immutable/chunks/entry.vAbeKpqR.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/chunks/Container.CWcU-xxO.js"];
export const stylesheets = ["_app/immutable/assets/0.BEBXiyHx.css","_app/immutable/assets/UserHeader.wercszHl.css"];
export const fonts = [];
