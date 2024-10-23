export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/about": [3],
		"/concept": [4],
		"/e/[nostr_ref]": [5],
		"/ngit": [6],
		"/p/[npub]": [7],
		"/quick-start": [8],
		"/repos": [20],
		"/repo/[repo_identifier]": [15],
		"/repo/[repo_identifier]/issues": [17],
		"/repo/[repo_identifier]/issue/[event_id]": [16],
		"/repo/[repo_identifier]/proposals": [19],
		"/repo/[repo_identifier]/proposal/[event_id]": [18],
		"/r/[repo_naddr]": [9],
		"/r/[repo_naddr]/issues": [10],
		"/r/[repo_naddr]/issues/new": [11],
		"/r/[repo_naddr]/issues/[issue_nip19]": [12],
		"/r/[repo_naddr]/proposals": [13],
		"/r/[repo_naddr]/proposals/[proposal_nip19]": [14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';