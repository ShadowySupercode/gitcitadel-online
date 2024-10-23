

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.1-WcDrFv.js","_app/immutable/chunks/scheduler.DrQRk8ea.js","_app/immutable/chunks/index.CcdvbsEI.js","_app/immutable/chunks/Container.CWcU-xxO.js"];
export const stylesheets = [];
export const fonts = [];
