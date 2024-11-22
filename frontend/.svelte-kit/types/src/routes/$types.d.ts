import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/about" | "/concept" | "/e/[nostr_ref]" | "/ngit" | "/p/[npub]" | "/quick-start" | "/r/[repo_naddr]" | "/r/[repo_naddr]/issues" | "/r/[repo_naddr]/issues/new" | "/r/[repo_naddr]/issues/[issue_nip19]" | "/r/[repo_naddr]/proposals" | "/r/[repo_naddr]/proposals/[proposal_nip19]" | "/repo/[repo_identifier]" | "/repo/[repo_identifier]/issue/[event_id]" | "/repo/[repo_identifier]/issues" | "/repo/[repo_identifier]/proposal/[event_id]" | "/repo/[repo_identifier]/proposals" | "/repos" | null
type LayoutParams = RouteParams & { nostr_ref?: string; npub?: string; repo_naddr?: string; issue_nip19?: string; proposal_nip19?: string; repo_identifier?: string; event_id?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type LayoutServerData = null;
export type LayoutLoad<OutputData extends OutputDataShape<LayoutParentData> = OutputDataShape<LayoutParentData>> = Kit.Load<LayoutParams, LayoutServerData, LayoutParentData, OutputData, LayoutRouteId>;
export type LayoutLoadEvent = Parameters<LayoutLoad>[0];
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutParentData & EnsureDefined<LayoutServerData>> & OptionalUnion<EnsureDefined<LayoutParentData & EnsureDefined<LayoutServerData>>>>;