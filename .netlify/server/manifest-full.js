export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["service-worker.js"]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.b327580b.js","app":"_app/immutable/entry/app.c137b507.js","imports":["_app/immutable/entry/start.b327580b.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/singletons.51238f48.js","_app/immutable/chunks/index.9d57cde4.js","_app/immutable/entry/app.c137b507.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/index.71d5d8ed.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
