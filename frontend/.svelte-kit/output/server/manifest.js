export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["concept.md","favicon.png","icons/icon-120x120.png","icons/icon-152x152.png","icons/icon-16x16.png","icons/icon-180x180.png","icons/icon-192x192.png","icons/icon-32x32.png","icons/icon-48x48.png","icons/icon-512x512.png","icons/icon-57x57.png","icons/icon-60x60.png","icons/icon-76x76.png","icons/icon.svg","manifest.json"]),
	mimeTypes: {".md":"text/markdown",".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.WFF6V6Pc.js","app":"_app/immutable/entry/app.CZk9IvYL.js","imports":["_app/immutable/entry/start.WFF6V6Pc.js","_app/immutable/chunks/entry.vAbeKpqR.js","_app/immutable/chunks/scheduler.DrQRk8ea.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/entry/app.CZk9IvYL.js","_app/immutable/chunks/scheduler.DrQRk8ea.js","_app/immutable/chunks/index.CcdvbsEI.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/concept",
				pattern: /^\/concept\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/e/[nostr_ref]",
				pattern: /^\/e\/([^/]+?)\/?$/,
				params: [{"name":"nostr_ref","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/ngit",
				pattern: /^\/ngit\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/p/[npub]",
				pattern: /^\/p\/([^/]+?)\/?$/,
				params: [{"name":"npub","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/quick-start",
				pattern: /^\/quick-start\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/repos",
				pattern: /^\/repos\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/repo/[repo_identifier]",
				pattern: /^\/repo\/([^/]+?)\/?$/,
				params: [{"name":"repo_identifier","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/repo/[repo_identifier]/issues",
				pattern: /^\/repo\/([^/]+?)\/issues\/?$/,
				params: [{"name":"repo_identifier","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/repo/[repo_identifier]/issue/[event_id]",
				pattern: /^\/repo\/([^/]+?)\/issue\/([^/]+?)\/?$/,
				params: [{"name":"repo_identifier","optional":false,"rest":false,"chained":false},{"name":"event_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/repo/[repo_identifier]/proposals",
				pattern: /^\/repo\/([^/]+?)\/proposals\/?$/,
				params: [{"name":"repo_identifier","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/repo/[repo_identifier]/proposal/[event_id]",
				pattern: /^\/repo\/([^/]+?)\/proposal\/([^/]+?)\/?$/,
				params: [{"name":"repo_identifier","optional":false,"rest":false,"chained":false},{"name":"event_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]",
				pattern: /^\/r\/([^/]+?)\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]/issues",
				pattern: /^\/r\/([^/]+?)\/issues\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]/issues/new",
				pattern: /^\/r\/([^/]+?)\/issues\/new\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]/issues/[issue_nip19]",
				pattern: /^\/r\/([^/]+?)\/issues\/([^/]+?)\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false},{"name":"issue_nip19","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]/proposals",
				pattern: /^\/r\/([^/]+?)\/proposals\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/r/[repo_naddr]/proposals/[proposal_nip19]",
				pattern: /^\/r\/([^/]+?)\/proposals\/([^/]+?)\/?$/,
				params: [{"name":"repo_naddr","optional":false,"rest":false,"chained":false},{"name":"proposal_nip19","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
