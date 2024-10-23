import { c as create_ssr_component, a as subscribe, v as validate_component, h as add_attribute, e as escape, b as get_store_value, f as each, k as add_classes, o as onDestroy } from "./ssr.js";
import { l as logged_in_user, U as UserHeader, u as user_relays, g as getUserRelays, c as icons_misc, E as EventCard, S as Status, d as ensureUser } from "./UserHeader.js";
import { A as defaults, k as selected_repo_event, v as selected_repo_collection, n as ndk, B as reply_kind, a as repo_kind, b as base_relays, x as proposal_status_draft, q as statusKindtoText, l as proposal_status_open, m as proposal_status_applied, o as proposal_status_closed, C as getName, z as summary_defaults, D as full_defaults } from "./type.js";
import { NDKEvent, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { s as selected_issue_full, c as selected_proposal_full, d as selected_proposal_replies } from "./Issue.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { C as Container } from "./Container.js";
const Compose = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  let { sendReply = () => {
  } } = $$props;
  let { placeholder = "reply..." } = $$props;
  let { submitting = false } = $$props;
  let { logged_in = false } = $$props;
  let content = "";
  if ($$props.sendReply === void 0 && $$bindings.sendReply && sendReply !== void 0) $$bindings.sendReply(sendReply);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.submitting === void 0 && $$bindings.submitting && submitting !== void 0) $$bindings.submitting(submitting);
  if ($$props.logged_in === void 0 && $$bindings.logged_in && logged_in !== void 0) $$bindings.logged_in(logged_in);
  $$unsubscribe_logged_in_user();
  return `<div class="flex pt-5"><div class="mt-0 flex-none px-3">${validate_component(UserHeader, "UserHeader").$$render(
    $$result,
    {
      avatar_only: true,
      user: $logged_in_user || { ...defaults, loading: false }
    },
    {},
    {}
  )}</div> <div class="flex-grow pt-2">${!submitting ? `<textarea class="textarea textarea-primary w-full"${add_attribute("placeholder", placeholder, 0)}>${escape("")}</textarea>` : ``} <div class="flex"><div class="flex-auto"></div> <button ${submitting || content.length === 0 ? "disabled" : ""} class="align-right btn btn-primary btn-sm mt-2 align-bottom">${submitting ? `Sending` : `${!logged_in ? `Login before Sending` : `Send`}`}</button></div></div></div>`;
});
const ComposeReply = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  let $selected_repo_event, $$unsubscribe_selected_repo_event;
  let $selected_repo_collection, $$unsubscribe_selected_repo_collection;
  let $selected_issue_full, $$unsubscribe_selected_issue_full;
  let $selected_proposal_full, $$unsubscribe_selected_proposal_full;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => $selected_repo_event = value);
  $$unsubscribe_selected_repo_collection = subscribe(selected_repo_collection, (value) => $selected_repo_collection = value);
  $$unsubscribe_selected_issue_full = subscribe(selected_issue_full, (value) => $selected_issue_full = value);
  $$unsubscribe_selected_proposal_full = subscribe(selected_proposal_full, (value) => $selected_proposal_full = value);
  let { type = "proposal" } = $$props;
  let { event } = $$props;
  let { sentFunction = () => {
  } } = $$props;
  let repo_identifier;
  let selected_proposal_or_issue;
  let submitting = false;
  let submitted = false;
  let edit_mode = false;
  const getRootId = (event2) => {
    let root_tag = event2.tags.find((t) => t[0] === "e" && t.length === 4 && t[3] === "root");
    if (root_tag) return root_tag[1];
    if (event2.tags.some((t) => t[0] === "t" && t[1] === "root")) return event2.id;
    return selected_proposal_or_issue.summary.id;
  };
  async function sendReply(content) {
    if (!$logged_in_user) return;
    let new_event = new NDKEvent(ndk);
    new_event.kind = reply_kind;
    new_event.tags.push(["e", getRootId(event), $selected_repo_event.relays[0] || "", "root"]);
    if (event.id.length > 0) {
      new_event.tags.push(["e", event.id, $selected_repo_event.relays[0] || "", "reply"]);
    }
    if ($selected_repo_event.unique_commit) {
      new_event.tags.push(["r", $selected_repo_event.unique_commit]);
    }
    $selected_repo_collection.maintainers.forEach((m) => {
      new_event.tags.push(["a", `${repo_kind}:${m}:${repo_identifier}`]);
    });
    let parent_event_user_relay = user_relays[event.pubkey] ? get_store_value(user_relays[event.pubkey]).ndk_relays?.writeRelayUrls[0] : void 0;
    if (event.pubkey !== $logged_in_user?.hexpubkey) new_event.tags.push(parent_event_user_relay ? ["p", event.pubkey, parent_event_user_relay] : ["p", event.pubkey]);
    event.tags.filter((tag) => tag[0] === "p").forEach((tag) => {
      if (
        // not duplicate
        !new_event.tags.some((t) => t[1] === tag[1]) && // not current user (dont tag self)
        tag[1] !== $logged_in_user?.hexpubkey
      ) new_event.tags.push(tag);
    });
    new_event.content = content;
    submitting = true;
    let relays = [
      ...$selected_repo_event.relays.length > 3 ? $selected_repo_event.relays : [...base_relays].concat($selected_repo_event.relays)
    ];
    try {
      new_event.sign();
    } catch {
      alert("failed to sign event");
    }
    try {
      let user_relays2 = await getUserRelays($logged_in_user.hexpubkey);
      relays = [
        ...relays,
        ...user_relays2.ndk_relays ? user_relays2.ndk_relays.writeRelayUrls : []
      ];
    } catch {
    }
    try {
      let root_event_user_relays = await getUserRelays(event.pubkey);
      relays = [
        ...relays,
        ...root_event_user_relays.ndk_relays ? root_event_user_relays.ndk_relays.writeRelayUrls : []
      ];
    } catch {
    }
    try {
      let _ = await new_event.publish(NDKRelaySet.fromRelayUrls([...new Set(relays)], ndk));
      submitting = false;
      submitted = true;
      setTimeout(
        () => {
          submitted = false;
          sentFunction();
        },
        3e3
      );
    } catch {
    }
  }
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  if ($$props.sentFunction === void 0 && $$bindings.sentFunction && sentFunction !== void 0) $$bindings.sentFunction(sentFunction);
  {
    {
      repo_identifier = $selected_repo_event.identifier;
      selected_proposal_or_issue = type === "proposal" ? $selected_proposal_full : $selected_issue_full;
      edit_mode = repo_identifier.length > 0 && selected_proposal_or_issue.summary.id.length > 0 && !submitted;
    }
  }
  $$unsubscribe_logged_in_user();
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_selected_repo_collection();
  $$unsubscribe_selected_issue_full();
  $$unsubscribe_selected_proposal_full();
  return `${edit_mode ? `${validate_component(Compose, "Compose").$$render(
    $$result,
    {
      sendReply,
      submitting,
      logged_in: !!$logged_in_user
    },
    {},
    {}
  )}` : ``} ${submitted ? `<div role="alert" class="alert mt-6" data-svelte-h="svelte-ma2cnz"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div><h3 class="prose mb-2 text-sm font-bold">reply sent</h3></div></div>` : ``}`;
});
const ThreadWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { num_replies = 0 } = $$props;
  if ($$props.num_replies === void 0 && $$bindings.num_replies && num_replies !== void 0) $$bindings.num_replies(num_replies);
  return `<div class="border-l border-blue-500 pl-1">${num_replies > 0 ? `${`<div class="${["opacity-60 hover:opacity-90", "relative"].join(" ").trim()}"><button class="${["-ml-1 -mt-8", "absolute"].join(" ").trim()}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-7 w-7 flex-none fill-blue-500 pt-1">${each(
    icons_misc.chevron_up,
    (p) => {
      return `<path${add_attribute("d", p, 0)}></path>`;
    }
  )}</svg></button></div>`}` : ``} <div${add_classes("".trim())}>${slots.default ? slots.default({}) : ``}</div></div>`;
});
const ThreadTree = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tree } = $$props;
  let { type = "proposal" } = $$props;
  let { show_compose = false } = $$props;
  const countReplies = (tree2, starting = 0) => {
    return tree2.child_nodes.length + tree2.child_nodes.reduce((a, c) => a + countReplies(c), starting);
  };
  if ($$props.tree === void 0 && $$bindings.tree && tree !== void 0) $$bindings.tree(tree);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.show_compose === void 0 && $$bindings.show_compose && show_compose !== void 0) $$bindings.show_compose(show_compose);
  return `${tree ? `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: tree.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(tree) }, {}, {
    default: () => {
      return `${each(tree.child_nodes, (layer1) => {
        return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer1.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer1) }, {}, {
          default: () => {
            return `${each(layer1.child_nodes, (layer2) => {
              return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer2.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer2) }, {}, {
                default: () => {
                  return `${each(layer2.child_nodes, (layer3) => {
                    return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer3.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer3) }, {}, {
                      default: () => {
                        return `${each(layer3.child_nodes, (layer4) => {
                          return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer4.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer4) }, {}, {
                            default: () => {
                              return `${each(layer4.child_nodes, (layer5) => {
                                return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer5.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer5) }, {}, {
                                  default: () => {
                                    return `${each(layer5.child_nodes, (layer6) => {
                                      return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer6.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer6) }, {}, {
                                        default: () => {
                                          return `${each(layer6.child_nodes, (layer7) => {
                                            return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer7.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer7) }, {}, {
                                              default: () => {
                                                return `${each(layer7.child_nodes, (layer8) => {
                                                  return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer8.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer8) }, {}, {
                                                    default: () => {
                                                      return `${each(layer8.child_nodes, (layer9) => {
                                                        return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer9.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer9) }, {}, {
                                                          default: () => {
                                                            return `${each(layer9.child_nodes, (layer10) => {
                                                              return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer10.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer10) }, {}, {
                                                                default: () => {
                                                                  return `${each(layer10.child_nodes, (layer11) => {
                                                                    return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer11.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer11) }, {}, {
                                                                      default: () => {
                                                                        return `${each(layer11.child_nodes, (layer12) => {
                                                                          return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer12.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer12) }, {}, {
                                                                            default: () => {
                                                                              return `${each(layer12.child_nodes, (layer13) => {
                                                                                return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer13.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer13) }, {}, {
                                                                                  default: () => {
                                                                                    return `${each(layer13.child_nodes, (layer14) => {
                                                                                      return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer14.event }, {}, {})} ${validate_component(ThreadWrapper, "ThreadWrapper").$$render($$result, { num_replies: countReplies(layer14) }, {}, {
                                                                                        default: () => {
                                                                                          return `${each(layer14.child_nodes, (layer15) => {
                                                                                            return `${validate_component(EventCard, "EventCard").$$render($$result, { type, event: layer15.event }, {}, {})}`;
                                                                                          })} `;
                                                                                        }
                                                                                      })}`;
                                                                                    })} `;
                                                                                  }
                                                                                })}`;
                                                                              })} `;
                                                                            }
                                                                          })}`;
                                                                        })} `;
                                                                      }
                                                                    })}`;
                                                                  })} `;
                                                                }
                                                              })}`;
                                                            })} `;
                                                          }
                                                        })}`;
                                                      })} `;
                                                    }
                                                  })}`;
                                                })} `;
                                              }
                                            })}`;
                                          })} `;
                                        }
                                      })}`;
                                    })} `;
                                  }
                                })}`;
                              })} `;
                            }
                          })}`;
                        })} `;
                      }
                    })}`;
                  })} `;
                }
              })}`;
            })} `;
          }
        })}`;
      })} ${show_compose ? `${validate_component(ComposeReply, "ComposeReply").$$render($$result, { type, event: tree.event }, {}, {})}` : ``}`;
    }
  })}` : ``}`;
});
const getParentId = (reply) => {
  const t = reply.tags.find((tag) => tag.length === 4 && tag[3] === "reply") || reply.tags.find((tag) => tag.length === 4 && tag[3] === "root") || // include events that don't use nip 10 markers
  reply.tags.find((tag) => tag.length < 4 && tag[0] === "e");
  return t ? t[1] : void 0;
};
const createThreadTree = (replies) => {
  const hashTable = /* @__PURE__ */ Object.create(null);
  replies.forEach(
    (reply) => hashTable[reply.id] = { event: reply, child_nodes: [] }
  );
  const thread_tree = [];
  replies.forEach((reply) => {
    const reply_parent_id = getParentId(reply);
    if (reply_parent_id && hashTable[reply_parent_id]) {
      hashTable[reply_parent_id].child_nodes.push(hashTable[reply.id]);
      hashTable[reply_parent_id].child_nodes.sort(
        (a, b) => (a.event.created_at || 0) - (b.event.created_at || 0)
      );
    } else thread_tree.push(hashTable[reply.id]);
  });
  return thread_tree;
};
const splitIntoRevisionThreadTrees = (tree) => {
  const thread_revision_trees = [
    {
      ...tree,
      child_nodes: [...tree?.child_nodes]
    }
  ];
  thread_revision_trees[0].child_nodes = [
    ...thread_revision_trees[0].child_nodes.filter((n) => {
      if (n.event.tags.some((t) => t.length > 1 && t[1] === "revision-root")) {
        thread_revision_trees.push(n);
        return false;
      }
      return true;
    })
  ];
  return thread_revision_trees.sort(
    (a, b) => (a.event.created_at || 0) - (b.event.created_at || 0)
  );
};
const getThreadTrees = (type, event, replies) => {
  if (event) {
    const all_trees = createThreadTree(replies ? [event, ...replies] : [event]);
    const event_tree = all_trees.find((t) => t.event.id === event.id);
    if (event_tree) {
      if (type === "proposal") return splitIntoRevisionThreadTrees(event_tree);
      return [event_tree];
    }
  }
  return [];
};
const Thread = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let thread_trees;
  let { event } = $$props;
  let { type = "proposal" } = $$props;
  let { show_compose = true } = $$props;
  let { replies = void 0 } = $$props;
  if ($$props.event === void 0 && $$bindings.event && event !== void 0) $$bindings.event(event);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.show_compose === void 0 && $$bindings.show_compose && show_compose !== void 0) $$bindings.show_compose(show_compose);
  if ($$props.replies === void 0 && $$bindings.replies && replies !== void 0) $$bindings.replies(replies);
  thread_trees = getThreadTrees(type, event, replies);
  return `${each(thread_trees, (tree, i) => {
    return `${i > 0 ? `<div class="divider" data-svelte-h="svelte-wmmvxz">new revision</div>` : ``} ${validate_component(ThreadTree, "ThreadTree").$$render(
      $$result,
      {
        type,
        tree,
        show_compose: show_compose && thread_trees.length - 1 === i
      },
      {},
      {}
    )}`;
  })}`;
});
const StatusSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  let $$unsubscribe_selected_repo_event;
  let $$unsubscribe_selected_proposal_replies;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  $$unsubscribe_selected_repo_event = subscribe(selected_repo_event, (value) => value);
  $$unsubscribe_selected_proposal_replies = subscribe(selected_proposal_replies, (value) => value);
  let { status = void 0 } = $$props;
  let { type = "proposal" } = $$props;
  let { proposal_or_issue_id = "" } = $$props;
  let edit_mode = false;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.proposal_or_issue_id === void 0 && $$bindings.proposal_or_issue_id && proposal_or_issue_id !== void 0) $$bindings.proposal_or_issue_id(proposal_or_issue_id);
  {
    {
      edit_mode = $logged_in_user !== void 0;
    }
  }
  $$unsubscribe_logged_in_user();
  $$unsubscribe_selected_repo_event();
  $$unsubscribe_selected_proposal_replies();
  return `${!status ? `${validate_component(Status, "Status").$$render($$result, { type }, {}, {})}` : `<div class="dropdown">${validate_component(Status, "Status").$$render($$result, { type, edit_mode, status }, {}, {})} ${edit_mode ? `<ul${add_attribute("tabindex", 0, 0)} class="menu dropdown-content z-[1] ml-0 w-52 rounded-box bg-base-300 p-2 shadow">${status !== proposal_status_draft && type !== "issue" ? `<li class="my-2 pl-0"><button class="btn btn-neutral btn-sm mx-2 align-middle">${escape(statusKindtoText(proposal_status_draft, type))}</button></li>` : ``} ${status !== proposal_status_open ? `<li class="my-2 pl-0"><button class="btn btn-success btn-sm mx-2 align-middle">${escape(statusKindtoText(proposal_status_open, type))}</button></li>` : ``} ${status !== proposal_status_applied ? `<li class="my-2 pl-0"><button class="btn btn-primary btn-sm mx-2 align-middle">${escape(statusKindtoText(proposal_status_applied, type))}</button></li>` : ``} ${status !== proposal_status_closed ? `<li class="my-2 pl-0"><button class="btn btn-neutral btn-sm mx-2 align-middle">${escape(statusKindtoText(proposal_status_closed, type))}</button></li>` : ``}</ul>` : ``}</div>`}`;
});
const ProposalHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logged_in_user, $$unsubscribe_logged_in_user;
  $$unsubscribe_logged_in_user = subscribe(logged_in_user, (value) => $logged_in_user = value);
  dayjs.extend(relativeTime);
  let { type = "proposal" } = $$props;
  let { title: title_1, descritpion: descritpion_1, repo_a: repo_a_1, id: id_1, comments: comments_1, status: status_1, status_date: status_date_1, author: author_1, created_at: created_at_1, loading: loading_1 } = summary_defaults;
  let { title = title_1, descritpion = descritpion_1, repo_a = repo_a_1, id = id_1, comments = comments_1, status = status_1, status_date = status_date_1, author = author_1, created_at = created_at_1, loading = loading_1 } = $$props;
  let short_title;
  let created_at_ago;
  let author_name = "";
  let author_object = { ...defaults };
  let unsubscriber;
  onDestroy(() => {
    if (unsubscriber) unsubscriber();
  });
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.descritpion === void 0 && $$bindings.descritpion && descritpion !== void 0) $$bindings.descritpion(descritpion);
  if ($$props.repo_a === void 0 && $$bindings.repo_a && repo_a !== void 0) $$bindings.repo_a(repo_a);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.comments === void 0 && $$bindings.comments && comments !== void 0) $$bindings.comments(comments);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  if ($$props.status_date === void 0 && $$bindings.status_date && status_date !== void 0) $$bindings.status_date(status_date);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0) $$bindings.author(author);
  if ($$props.created_at === void 0 && $$bindings.created_at && created_at !== void 0) $$bindings.created_at(created_at);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  {
    {
      if (typeof author === "string") {
        if (unsubscriber) unsubscriber();
        unsubscriber = ensureUser(author).subscribe((u) => {
          author_object = { ...u };
        });
      } else author_object = author;
    }
  }
  {
    {
      author_name = getName(author_object);
    }
  }
  {
    {
      if (title.length > 70) short_title = title.slice(0, 65) + "...";
      else if (title.length == 0) short_title = "Untitled";
      else short_title = title;
      created_at_ago = created_at ? dayjs(created_at * 1e3).fromNow() : "";
    }
  }
  $$unsubscribe_logged_in_user();
  return `<div class="grow border-b border-accent-content bg-base-200 pb-4 pt-2 text-xs text-neutral-content">${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${loading ? `<div data-svelte-h="svelte-1a97vds"><div class="skeleton h-7 w-60 pt-1"></div> <div class=""><div class="skeleton mt-3 inline-block h-8 w-20 align-middle"></div> <div class="skeleton ml-3 mt-5 inline-block h-3 w-28 align-middle"></div> <div class="skeleton ml-3 mt-5 inline-block h-3 w-28 align-middle"></div></div></div>` : `<div class="mb-2 text-lg text-base-content">${escape(short_title)}</div> <div class="pt-1"><div class="mr-3 inline align-middle">${!$logged_in_user ? `${validate_component(Status, "Status").$$render($$result, { type, status, edit_mode: false }, {}, {})}` : `${validate_component(StatusSelector, "StatusSelector").$$render($$result, { type, status, proposal_or_issue_id: id }, {}, {})}`}</div> <div class="mr-3 inline align-middle">opened ${escape(created_at_ago)}</div> <div class="inline align-middle">${author_object.loading ? `<div class="skeleton inline-block h-3 w-20 pb-2"></div>` : `${escape(author_name)}`}</div></div>`}`;
    }
  })}</div>`;
});
const ProposalDetails = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "proposal" } = $$props;
  let { summary = { ...summary_defaults } } = $$props;
  let { labels: labels_1, loading: loading_1 } = { ...full_defaults };
  let { labels = labels_1, loading = loading_1 } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.summary === void 0 && $$bindings.summary && summary !== void 0) $$bindings.summary(summary);
  if ($$props.labels === void 0 && $$bindings.labels && labels !== void 0) $$bindings.labels(labels);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  return `<div class="max-w-md"><div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div> <div class="badge skeleton my-2 block w-40"></div>` : `<h4 data-svelte-h="svelte-vm9afd">Author</h4> ${validate_component(UserHeader, "UserHeader").$$render($$result, { user: summary.author }, {}, {})}`}</div> <div>${loading ? `<div class="skeleton my-3 h-5 w-20"></div> <div class="badge skeleton my-2 block w-60"></div> <div class="badge skeleton my-2 block w-40"></div>` : `<h4 data-svelte-h="svelte-chnmc4">Status</h4> ${validate_component(StatusSelector, "StatusSelector").$$render(
    $$result,
    {
      type,
      status: summary.status,
      proposal_or_issue_id: summary.id
    },
    {},
    {}
  )}`}</div> <div>${loading ? `<div class="badge skeleton w-20"></div> <div class="badge skeleton w-20"></div>` : `<h4 data-svelte-h="svelte-1kgbosl">Labels</h4> ${each(labels, (label) => {
    return `<div class="badge badge-secondary mr-2">${escape(label)}</div>`;
  })}`}</div></div>`;
});
export {
  ProposalHeader as P,
  Thread as T,
  ProposalDetails as a
};
