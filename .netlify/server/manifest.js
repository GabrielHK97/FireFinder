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
		client: {"start":"_app/immutable/entry/start.50ed5e35.js","app":"_app/immutable/entry/app.7b3295ad.js","imports":["_app/immutable/entry/start.50ed5e35.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/singletons.5ec9b8a9.js","_app/immutable/chunks/index.9d57cde4.js","_app/immutable/entry/app.7b3295ad.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.9680c161.js","_app/immutable/chunks/index.71d5d8ed.js"],"stylesheets":[],"fonts":[]},
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
