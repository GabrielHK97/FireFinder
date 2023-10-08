

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.dce0083d.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/index.71d5d8ed.js","_app/immutable/chunks/singletons.5ec9b8a9.js","_app/immutable/chunks/index.9d57cde4.js"];
export const stylesheets = [];
export const fonts = [];
