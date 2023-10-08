

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.84b541dc.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/index.71d5d8ed.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.9d57cde4.js"];
export const stylesheets = ["_app/immutable/assets/2.7a2b3291.css"];
export const fonts = [];
