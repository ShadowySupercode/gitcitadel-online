import{s as h,b as v,e as y,f as R,k as S,d as u,j as k,i as E}from"../chunks/scheduler.DrQRk8ea.js";import{S as j,i as w,c as f,a as d,m as _,t as $,b as g,d as b}from"../chunks/index.CcdvbsEI.js";import{C}from"../chunks/Container.CWcU-xxO.js";import{R as O}from"../chunks/ReposSummaryList.DA-W97k9.js";import{w as T}from"../chunks/entry.vAbeKpqR.js";import{g as c,a as D,N as I,h as N,E as P,e as q,r as p}from"../chunks/Issue.bBFUSQy9.js";const z=({params:n})=>({repo_identifier:n.repo_identifier}),J=Object.freeze(Object.defineProperty({__proto__:null,load:z},Symbol.toStringTag,{value:"Module"})),i={},K=n=>{if(!Object.keys(i).includes(n)){i[n]=T({d:"",events:[],loading:!0});const t=c.subscribe({kinds:[D],"#d":[n]},{closeOnEose:!0},I.fromRelayUrls(N,c));t.on("event",r=>{const s=P(r);s&&s.identifier===n&&q(r).subscribe(e=>{i[n].update(o=>{let a=o.events,l=!1;return a.map(m=>m.author===e.author?(l=!0,e):m),l||(a=[...a,e]),{...o,events:a}})})}),t.on("eose",()=>{i[n].update(r=>({...r,loading:!1}))})}return i[n]};function L(n){let t,r,s;return r=new O({props:{title:`repositories for '${n[0].repo_identifier}'`,repos:n[1].events.map(p),loading:n[1].loading}}),{c(){t=y("div"),f(r.$$.fragment),this.h()},l(e){t=R(e,"DIV",{class:!0});var o=S(t);d(r.$$.fragment,o),o.forEach(u),this.h()},h(){k(t,"class","m-5")},m(e,o){E(e,t,o),_(r,t,null),s=!0},p(e,o){const a={};o&1&&(a.title=`repositories for '${e[0].repo_identifier}'`),o&2&&(a.repos=e[1].events.map(p)),o&2&&(a.loading=e[1].loading),r.$set(a)},i(e){s||($(r.$$.fragment,e),s=!0)},o(e){g(r.$$.fragment,e),s=!1},d(e){e&&u(t),b(r)}}}function M(n){let t,r;return t=new C({props:{$$slots:{default:[L]},$$scope:{ctx:n}}}),{c(){f(t.$$.fragment)},l(s){d(t.$$.fragment,s)},m(s,e){_(t,s,e),r=!0},p(s,[e]){const o={};e&11&&(o.$$scope={dirty:e,ctx:s}),t.$set(o)},i(s){r||($(t.$$.fragment,s),r=!0)},o(s){g(t.$$.fragment,s),r=!1},d(s){b(t,s)}}}function U(n,t,r){let s,{data:e}=t,o=K(e.repo_identifier||"");return v(n,o,a=>r(1,s=a)),n.$$set=a=>{"data"in a&&r(0,e=a.data)},[e,s,o]}class Q extends j{constructor(t){super(),w(this,t,U,M,h,{data:0})}}export{Q as component,J as universal};
