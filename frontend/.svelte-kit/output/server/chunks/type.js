import { nip19 } from "nostr-tools";
import last from "ramda/src/last";
import { w as writable } from "./index2.js";
import NDK, { NDKKind, NDKRepost, NDKEvent, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { b as get_store_value } from "./ssr.js";
const defaults = {
  loading: true,
  hexpubkey: "",
  npub: ""
};
function getName(user, truncate_above = 25) {
  return truncate(
    user.profile ? user.profile.name ? user.profile.name : user.profile.displayName ? user.profile.displayName : truncateNpub(user.npub) : truncateNpub(user.npub),
    truncate_above
  );
}
function truncateNpub(npub) {
  return `${npub.substring(0, 9)}...`;
}
function truncate(s, truncate_above = 20) {
  if (s.length < truncate_above || truncate_above < 5) return s;
  return `${s.substring(0, truncate_above - 3)}...`;
}
var NDKSvelte = class extends NDK {
  constructor(opts) {
    super(opts);
  }
  createEventStore(filters) {
    const store = writable([]);
    return {
      id: Math.random().toString(36).substring(7),
      refCount: 0,
      filters,
      subscription: void 0,
      eosed: false,
      set: store.set,
      update: store.update,
      subscribe: store.subscribe,
      unsubscribe: () => {
      },
      onEose: (cb) => {
      },
      onEvent: (cb) => {
      },
      startSubscription: () => {
        throw new Error("not implemented");
      },
      ref: () => {
        throw new Error("not implemented");
      },
      unref: () => {
        throw new Error("not implemented");
      },
      empty: () => {
        throw new Error("not implemented");
      },
      changeFilters: (filters2) => {
        throw new Error("not implemented");
      }
    };
  }
  eventIsRepost(event) {
    return [NDKKind.Repost, NDKKind.GenericRepost].includes(event.kind);
  }
  eventIsLabel(event) {
    return [NDKKind.Label].includes(event.kind);
  }
  storeSubscribe(filters, opts, klass) {
    let events = /* @__PURE__ */ new Map();
    const store = this.createEventStore(
      Array.isArray(filters) ? filters : [filters]
    );
    const autoStart = opts?.autoStart ?? true;
    const relaySet = opts?.relaySet;
    const handleEventLabel = (event) => {
      handleEventReposts(event);
    };
    const getEventArrayFromMap = () => {
      return Array.from(events.values());
    };
    const handleEventReposts = (event) => {
      const _repostEvent = NDKRepost.from(event);
      _repostEvent.ndk = this;
      const addRepostToExistingEvent = (repostedEvent) => {
        if (repostedEvent.repostedByEvents) {
          repostedEvent.repostedByEvents.push(event);
        } else {
          repostedEvent.repostedByEvents = [event];
        }
        store.set(getEventArrayFromMap());
      };
      for (const repostedEventId of _repostEvent.repostedEventIds()) {
        const repostedEvent = events.get(repostedEventId);
        if (repostedEvent) {
          addRepostToExistingEvent(repostedEvent);
        } else {
          _repostEvent.repostedEvents(
            klass,
            { subId: "reposted-event-fetch", groupable: true, groupableDelay: 1500, groupableDelayType: "at-least" }
          ).then((fetchedEvents) => {
            for (const e of fetchedEvents) {
              if (e instanceof NDKEvent) {
                handleEvent(e);
              }
            }
          });
        }
      }
    };
    const handleEvent = (event) => {
      if (opts?.repostsFilters && this.eventIsRepost(event)) {
        handleEventReposts(event);
        return;
      }
      if (this.eventIsLabel(event)) {
        handleEventLabel(event);
        return;
      }
      let e = event;
      if (klass) {
        const ev = klass.from(event);
        if (!ev)
          return;
        e = ev;
        e.relay = event.relay;
      }
      e.ndk = this;
      const dedupKey = event.deduplicationKey();
      if (events.has(dedupKey)) {
        let prevEvent = events.get(dedupKey);
        if (prevEvent.created_at > event.created_at)
          return;
        if (prevEvent.created_at === event.created_at) {
          if (prevEvent.id === event.id)
            return;
          console.warn("Received event with same created_at but different id", { prevId: prevEvent.id, newId: event.id, prev: prevEvent.rawEvent(), new: event.rawEvent() });
        }
      }
      events.set(dedupKey, e);
      store.set(getEventArrayFromMap());
    };
    store.ref = () => {
      store.refCount++;
      if (store.refCount === 1) {
        store.startSubscription();
      }
      return store.refCount;
    };
    store.unref = () => {
      if (--store.refCount > 0)
        return store.refCount;
      if (opts?.unrefUnsubscribeTimeout) {
        setTimeout(() => {
          if (store.refCount === 0) {
            store.unsubscribe();
          }
        }, opts.unrefUnsubscribeTimeout);
      } else {
        store.unsubscribe();
      }
      return store.refCount;
    };
    store.empty = () => {
      store.set([]);
      events = /* @__PURE__ */ new Map();
      store.unsubscribe();
    };
    store.changeFilters = (filters2) => {
      store.filters = filters2;
      store.empty();
      if (store.refCount > 0)
        store.startSubscription();
    };
    store.startSubscription = () => {
      if (!store.filters) {
        throw new Error("no filters");
      }
      const filters2 = store.filters;
      if (opts?.repostsFilters) {
        filters2.push(...opts.repostsFilters);
      }
      store.subscription = this.subscribe(filters2, opts, relaySet, false);
      store.subscription.on("event", (event, relay) => {
        handleEvent(event);
        if (opts?.onEvent)
          opts.onEvent(event, relay);
      });
      store.subscription.start();
      store.unsubscribe = () => {
        store.subscription?.stop();
        store.subscription = void 0;
      };
      store.onEose = (cb) => {
        store.subscription?.on("eose", () => {
          store.eosed = true;
          cb();
        });
      };
      if (opts?.onEose) {
        store.onEose(opts.onEose);
      }
    };
    if (autoStart) {
      store.startSubscription();
    }
    return store;
  }
};
var src_default = NDKSvelte;
const base_relays = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.nostr.band",
  "wss://purplerelay.com"
  // reliability untested
  // 'wss://relayable.org', // free but not so reliable
];
const ndk = new src_default({
  explicitRelayUrls: [...base_relays]
});
ndk.connect(5e3);
const first = (list) => list ? list[0] : void 0;
const fromNostrURI = (s) => s.replace(/^[\w+]+:\/?\/?/, "");
const urlIsMedia = (url) => !url.match(/\.(apk|docx|xlsx|csv|dmg)/) && last(url.split("://"))?.includes("/") || false;
const isImage = (url) => url.match(/^.*\.(jpg|jpeg|png|webp|gif|avif|svg)/gi);
const NEWLINE = "newline";
const LINK = "link";
const NOSTR_NPUB = "nostr:npub";
const NOSTR_NPROFILE = "nostr:nprofile";
const NOSTR_NOTE = "nostr:note";
const NOSTR_NEVENT = "nostr:nevent";
const NOSTR_NADDR = "nostr:naddr";
const TEXT = "text";
const isParsedNewLine = (part) => part.type == NEWLINE;
const isParsedLink = (part) => part.type == LINK;
const isParsedNpub = (part) => part.type == NOSTR_NPUB;
const isParsedNprofile = (part) => part.type == NOSTR_NPROFILE;
const isParsedNevent = (part) => part.type == NOSTR_NEVENT;
const isParsedNote = (part) => part.type == NOSTR_NOTE;
const isParsedNaddr = (part) => part.type == NOSTR_NADDR;
const isParsedText = (part) => part.type == TEXT;
const parseContent = (content, tags) => {
  const result = [];
  let text = content.trim();
  let buffer = "";
  const getIMeta = (url) => {
    const imeta_tag_for_url = tags.find(
      (tag) => tag[0] === "imeta" && tag.some((e) => e.includes(url))
    );
    if (!imeta_tag_for_url) return void 0;
    const pairs = imeta_tag_for_url.map((s) => [
      s.split(" ")[0],
      s.substring(s.indexOf(" ") + 1)
    ]);
    return {
      url,
      m: pairs.find((p) => p[0] === "m")?.[1],
      alt: pairs.find((p) => p[0] === "alt")?.[1],
      x: pairs.find((p) => p[0] === "x")?.[1],
      size: pairs.find((p) => p[0] === "size")?.[1],
      dim: pairs.find((p) => p[0] === "dim")?.[1],
      blurhash: pairs.find((p) => p[0] === "blurhash")?.[1],
      fallback: pairs.filter((p) => p[0] === "fallback")?.map((p) => p[1])
    };
  };
  const parseNewline = () => {
    const newline = first(text.match(/^\n+/));
    if (newline) {
      return [newline, { type: NEWLINE, value: newline }];
    }
  };
  const parseUrl = () => {
    const raw = first(
      text.match(
        /^([a-z\+:]{2,30}:\/\/)?[^<>\(\)\s]+\.[a-z]{2,6}[^\s]*[^<>"'\.!?,:\s\)\(]/gi
      )
    );
    if (!raw) {
      return;
    }
    const prev = last(result);
    if (prev?.type === TEXT && prev.value.endsWith("/")) {
      return;
    }
    let url = raw;
    if (url.match(/\.\./)) {
      return;
    }
    if (!url.match("://")) {
      url = "https://" + url;
    }
    return [
      raw,
      { type: LINK, url, is_media: urlIsMedia(url), imeta: getIMeta(url) }
    ];
  };
  const parseNostrLinks = () => {
    const bech32 = first(
      text.match(
        /^(web\+)?(nostr:)?\/?\/?n(event|ote|profile|pub|addr)1[\d\w]+/i
      )
    );
    if (bech32) {
      try {
        const entity = fromNostrURI(bech32);
        const decoded = nip19.decode(entity);
        if (decoded.type === "npub") {
          return [bech32, { type: NOSTR_NPUB, hex: decoded.data }];
        }
        if (decoded.type === "nprofile") {
          return [bech32, { type: NOSTR_NPUB, hex: decoded.data.pubkey }];
        }
        if (decoded.type === "note") {
          return [bech32, { type: NOSTR_NOTE, data: { id: decoded.data } }];
        }
        if (decoded.type === "nevent") {
          return [bech32, { type: NOSTR_NEVENT, data: decoded.data }];
        }
        if (decoded.type === "naddr") {
          return [bech32, { type: NOSTR_NADDR, data: decoded.data }];
        }
      } catch {
      }
    }
  };
  while (text) {
    const part = parseNewline() || parseUrl() || parseNostrLinks();
    if (part) {
      if (buffer) {
        result.push({ type: TEXT, value: buffer });
        buffer = "";
      }
      const [raw, parsed] = part;
      result.push(parsed);
      text = text.slice(raw.length);
    } else {
      const match = first(text.match(/^[\w\d]+ ?/i)) || text[0];
      buffer += match;
      text = text.slice(match.length);
    }
  }
  if (buffer) {
    result.push({ type: TEXT, value: buffer });
  }
  return result;
};
const isCoverLetter = (s) => {
  return s.indexOf("PATCH 0/") > 0;
};
function extractTagContent(name, tags) {
  const tag = tags.find((tag2) => tag2[0] === name);
  return tag ? tag[1] : void 0;
}
const extractPatchMessage = (s) => {
  try {
    if (isCoverLetter(s)) {
      return s.substring(s.indexOf("] ") + 2);
    }
    const t = s.split("\nSubject: [")[1].split("] ")[1];
    if (t.split("\n\n---\n ").length > 1) return t.split("\n\n---\n ")[0];
    return t.split("\n\ndiff --git ")[0].split("\n\n ").slice(0, -1).join("");
  } catch {
    return void 0;
  }
};
const extractIssueTitle = (event) => {
  return event.tagValue("subject") || event.content.split("\n")[0] || "";
};
const extractIssueDescription = (s) => {
  const split = s.split("\n");
  if (split.length === 0) return "";
  return s.substring(split[0].length) || "";
};
const reply_kind = 1;
const proposal_status_open = 1630;
const proposal_status_applied = 1631;
const proposal_status_closed = 1632;
const proposal_status_draft = 1633;
const proposal_status_kinds = [
  proposal_status_open,
  proposal_status_applied,
  proposal_status_closed,
  proposal_status_draft
];
function statusKindtoText(kind, type) {
  if (kind === proposal_status_open) return "Open";
  if (type === "proposal" && kind === proposal_status_applied) return "Applied";
  if (type === "issue" && kind === proposal_status_applied) return "Resolved";
  if (kind === proposal_status_closed) return "Closed";
  return "Draft";
}
const repo_kind = 30617;
const patch_kind = 1617;
const issue_kind = 1621;
const event_defaults = {
  event_id: "",
  naddr: "",
  author: "",
  identifier: "",
  unique_commit: "",
  name: "",
  description: "",
  clone: [],
  web: [],
  tags: [],
  maintainers: [],
  relays: [],
  referenced_by: [],
  most_recent_reference_timestamp: 0,
  created_at: 0,
  loading: true
};
const collection_defaults = {
  selected_a: "",
  most_recent_index: -1,
  maintainers: [],
  events: [],
  loading: true
};
const summary_defaults$1 = {
  name: "",
  identifier: "",
  naddr: "",
  unique_commit: void 0,
  description: "",
  maintainers: [{ ...defaults }],
  loading: false,
  created_at: 0,
  most_recent_reference_timestamp: 0
};
const readme_defaults = {
  md: "",
  loading: true,
  failed: false
};
const selectRepoFromCollection = (collection) => {
  return collection.events[collection.most_recent_index];
};
const cloneArrayToReadMeUrls = (clone) => {
  const addresses = clone.map(extractRepoAddress);
  return [
    ...addresses.flatMap((address) => {
      let prefix = "raw/HEAD";
      if (address.includes("sr.ht")) prefix = "blob/HEAD";
      if (address.includes("git.launchpad.net") || address.includes("git.savannah.gnu.org"))
        prefix = "plain";
      if (address.includes("github.com")) {
        address = address.replace("github.com", "raw.githubusercontent.com");
        prefix = "HEAD";
      }
      return ["README.md", "readme.md"].map(
        (filename) => `https://${address}/${prefix}/${filename}`
      );
    })
  ];
};
const extractRepoAddress = (clone_string) => {
  let s = clone_string;
  if (s.endsWith("/")) s = s.substring(0, s.length - 1);
  if (s.endsWith(".git")) s = s.substring(0, s.length - 4);
  if (s.includes("://")) s = s.split("://")[1];
  if (s.includes("@")) s = s.split("@")[1];
  s = s.replace(/\s|:[0-9]+/g, "");
  s = s.replace(":", "/");
  return s;
};
const naddrToPointer = (s) => {
  const decoded = nip19.decode(s);
  if (typeof decoded.data === "string" || !Object.keys(decoded.data).includes("identifier"))
    return void 0;
  return decoded.data;
};
const extractAReference = (a) => {
  if (a.split(":").length !== 3) return void 0;
  const [k, pubkey, identifier] = a.split(":");
  return { kind: Number(k), pubkey, identifier };
};
const naddrToRepoA = (s) => {
  const pointer = naddrToPointer(s);
  if (pointer && pointer.kind === repo_kind)
    return `${repo_kind}:${pointer.pubkey}:${pointer.identifier}`;
  return void 0;
};
const aToNaddr = (a) => {
  const a_ref = typeof a === "string" ? extractAReference(a) : a;
  if (!a_ref) return void 0;
  return nip19.naddrEncode(a_ref);
};
const neventOrNoteToHexId = (s) => {
  try {
    const decoded = nip19.decode(s);
    if (decoded.type === "note") return decoded.data;
    else if (decoded.type === "nevent") return decoded.data.id;
  } catch {
  }
  return void 0;
};
const repos = {};
const repo_collections = {};
const ensureRepo = (a, naddr_relays = void 0) => {
  if (typeof a !== "string") {
    const repo_event = eventToRepoEvent(a);
    if (repo_event) {
      const a2 = repoEventToARef(repo_event);
      repos[a2] = writable({ ...repo_event, loading: true });
      fetchReferencedBy(repo_event);
      return repos[a2];
    }
    return repos[""];
  }
  if (!repos[a]) {
    const base = {
      ...event_defaults
    };
    const a_ref = extractAReference(a);
    if (!a_ref) return writable(base);
    const { pubkey, identifier } = a_ref;
    repos[a] = writable({
      ...base,
      identifier,
      author: pubkey,
      naddr: aToNaddr(a_ref) || "",
      maintainers: [pubkey]
    });
    const sub = ndk.subscribe(
      { kinds: [repo_kind], "#d": [identifier], authors: [pubkey] },
      {
        groupable: true,
        // default 100
        groupableDelay: 200,
        closeOnEose: false
      },
      NDKRelaySet.fromRelayUrls([...base_relays, ...naddr_relays || []], ndk)
    );
    sub.on("event", (event) => {
      const repo_event = eventToRepoEvent(event);
      if (repo_event) {
        if (identifier === repo_event.identifier && pubkey === repo_event.author)
          repos[a].update(() => {
            return {
              ...repo_event
            };
          });
        fetchReferencedBy(repo_event);
      }
    });
    sub.on("eose", () => {
      repos[a].update((repo_event) => {
        return {
          ...repo_event,
          loading: false
        };
      });
    });
  }
  setTimeout(() => {
    repos[a].update((repo_event) => {
      return {
        ...repo_event,
        loading: false
      };
    });
  }, 5e3);
  return repos[a];
};
const returnRepo = async (a, naddr_relays = void 0) => {
  return new Promise((r) => {
    const unsubscriber = ensureRepo(a, naddr_relays).subscribe((c) => {
      if (!c.loading) {
        setTimeout(() => {
          if (unsubscriber) unsubscriber();
        }, 5);
        r(c);
      }
    });
  });
};
const ensureRepoCollection = (a, naddr_relays = void 0) => {
  if (!repo_collections[a]) {
    const base = {
      ...collection_defaults,
      selected_a: a
    };
    repo_collections[a] = writable(base);
    const a_ref = extractAReference(a);
    if (!a_ref) return repo_collections[a];
    const { pubkey, identifier } = a_ref;
    returnRepo(a, naddr_relays).then(async (repo_event) => {
      if (get_store_value(repo_collections[a]).events.length > 0) return;
      repo_collections[a].update((collection) => {
        return {
          ...collection,
          events: [repo_event],
          maintainers: repo_event.maintainers,
          most_recent_index: 0
        };
      });
      const new_maintainers = [];
      const addMaintainers = async (m) => {
        const m_repo_event = await returnRepo(`${repo_kind}:${m}:${identifier}`);
        repo_collections[a].update((collection) => {
          m_repo_event.maintainers.forEach((m2) => {
            if (![pubkey, ...collection.maintainers, ...new_maintainers].includes(
              m2
            ))
              new_maintainers.push(m2);
          });
          const events = [...collection.events, m_repo_event];
          const most_recent = events.sort(
            (a2, b) => b.created_at - a2.created_at
          )[0];
          return {
            ...collection,
            events,
            most_recent_index: events.findIndex(
              (e) => e.author === most_recent.author
            ),
            maintainers: [...collection.maintainers, ...new_maintainers]
          };
        });
      };
      await Promise.all(
        repo_event.maintainers.filter((m) => m !== pubkey).map((m) => addMaintainers(m))
      );
      while (new_maintainers.length > 0) {
        await Promise.all(new_maintainers.map((m) => addMaintainers(m)));
      }
      repo_collections[a].update((repo_collection) => {
        return {
          ...repo_collection,
          loading: false
        };
      });
    });
  }
  setTimeout(() => {
    repo_collections[a].update((repo_collection) => {
      return {
        ...repo_collection,
        loading: false
      };
    });
  }, 5e3);
  return repo_collections[a];
};
const returnRepoCollection = async (a) => {
  return new Promise((r) => {
    const unsubscriber = ensureRepoCollection(a).subscribe((c) => {
      if (!c.loading) {
        setTimeout(() => {
          if (unsubscriber) unsubscriber();
        }, 5);
        r(c);
      }
    });
  });
};
const repoEventToARef = (repo_event) => `${repo_kind}:${repo_event.author}:${repo_event.identifier}`;
const fetchReferencedBy = (repo_event) => {
  const relays_to_use = repo_event.relays.length < 3 ? repo_event.relays : [...base_relays].concat(repo_event.relays);
  const ref_sub = ndk.subscribe(
    {
      "#a": [repoEventToARef(repo_event)],
      limit: 10
    },
    {
      groupable: true,
      // default 100
      groupableDelay: 200,
      closeOnEose: true
    },
    NDKRelaySet.fromRelayUrls(relays_to_use, ndk)
  );
  ref_sub.on("event", (ref_event) => {
    repos[repoEventToARef(repo_event)].update((repo_event2) => {
      return {
        ...repo_event2,
        referenced_by: repo_event2.referenced_by.includes(ref_event.id) ? [...repo_event2.referenced_by] : [...repo_event2.referenced_by, ref_event.id],
        most_recent_reference_timestamp: ref_event.created_at && repo_event2.most_recent_reference_timestamp < ref_event.created_at ? ref_event.created_at : repo_event2.most_recent_reference_timestamp
      };
    });
  });
  ref_sub.on("eose", () => {
    repos[repoEventToARef(repo_event)].update((repo_event2) => {
      return {
        ...repo_event2,
        // finished loading repo_event as we have all referenced_by events
        loading: false
      };
    });
  });
};
const eventToRepoEvent = (event) => {
  if (event.kind !== repo_kind) return void 0;
  const maintainers = [event.pubkey];
  event.getMatchingTags("maintainers").forEach((t) => {
    t.forEach((v, i) => {
      if (i > 0 && v !== maintainers[0]) {
        try {
          nip19.npubEncode(v);
          maintainers.push(v);
        } catch {
        }
      }
    });
  });
  const relays = [];
  event.getMatchingTags("relays").forEach((t) => {
    t.forEach((v, i) => {
      if (i > 0) {
        relays.push(v);
      }
    });
  });
  const web = [];
  event.getMatchingTags("web").forEach((t) => {
    t.forEach((v, i) => {
      if (i > 0) {
        web.push(v);
      }
    });
  });
  const clone = [];
  event.getMatchingTags("clone").forEach((t) => {
    t.forEach((v, i) => {
      if (i > 0) {
        clone.push(v);
      }
    });
  });
  return {
    event_id: event.id,
    naddr: event.encode(),
    author: event.pubkey,
    identifier: event.replaceableDTag(),
    unique_commit: event.tagValue("r") || void 0,
    name: event.tagValue("name") || "",
    description: event.tagValue("description") || "",
    clone,
    web,
    tags: event.getMatchingTags("t").map((t) => t[1]) || [],
    maintainers,
    relays,
    referenced_by: [],
    most_recent_reference_timestamp: event.created_at || 0,
    created_at: event.created_at || 0,
    loading: true
    // loading until references fetched
  };
};
const repoCollectionToSummary = (collection) => {
  const selected = selectRepoFromCollection(collection);
  if (!selected) return void 0;
  return {
    name: selected.name,
    identifier: selected.identifier,
    naddr: selected.naddr,
    unique_commit: selected.unique_commit,
    description: selected.description,
    maintainers: selected.maintainers,
    loading: collection.loading,
    created_at: selected.created_at,
    most_recent_reference_timestamp: Math.max.apply(
      0,
      collection.events.map((e) => e.most_recent_reference_timestamp)
    )
  };
};
const repoEventToSummary = (event) => {
  return {
    name: event.name,
    identifier: event.identifier,
    naddr: event.naddr,
    unique_commit: event.unique_commit,
    description: event.description,
    maintainers: event.maintainers,
    loading: event.loading,
    created_at: event.created_at,
    most_recent_reference_timestamp: event.most_recent_reference_timestamp
  };
};
const selected_repo_collection = writable({
  ...collection_defaults
});
const selected_repo_event = writable({
  ...event_defaults
});
selected_repo_collection.subscribe((collection) => {
  const selected_from_collection = selectRepoFromCollection(collection);
  if (selected_from_collection)
    selected_repo_event.set({ ...selected_from_collection });
});
let selected_repo_a = "";
let selected_unsubscriber;
const ensureSelectedRepoCollection = (a, naddr_relays = void 0) => {
  if (selected_repo_a !== a) {
    let loading = true;
    selected_repo_a = a;
    if (selected_unsubscriber) selected_unsubscriber();
    selected_unsubscriber = ensureRepoCollection(a, naddr_relays).subscribe(
      (repo_collection) => {
        selected_repo_collection.set({ ...repo_collection });
        if (loading && !repo_collection.loading) {
          loading = false;
          const repo_event = selectRepoFromCollection(repo_collection);
          if (repo_event)
            ensureRepoReadme(repo_event.clone, repo_collection.selected_a);
        }
      }
    );
  }
  return selected_repo_collection;
};
const awaitSelectedRepoCollection = async (a) => {
  return new Promise((r) => {
    const unsubscriber = ensureSelectedRepoCollection(a).subscribe(
      (repo_collection) => {
        if (selected_repo_a === a && !repo_collection.loading) {
          setTimeout(() => {
            if (unsubscriber) unsubscriber();
          }, 5);
          r({ ...repo_collection });
        }
      }
    );
  });
};
const selected_repo_readme = writable({
  ...readme_defaults
});
const ensureRepoReadme = async (clone, a) => {
  selected_repo_readme.set({ ...readme_defaults });
  const update = (md = void 0) => {
    const latest_collection = get_store_value(selected_repo_collection);
    if ([latest_collection.selected_a, latest_collection.selected_a].includes(a)) {
      selected_repo_readme.set({
        md: md || "",
        loading: false,
        failed: !md
      });
    }
  };
  let text;
  try {
    let readme_urls = cloneArrayToReadMeUrls(clone);
    readme_urls = [
      ...readme_urls.filter((url) => url.includes("raw.githubusercontent.com")),
      ...readme_urls.filter(
        (url) => !url.includes("raw.githubusercontent.com")
      )
    ];
    for (let i = 0; i < readme_urls.length; i++) {
      try {
        const res = await fetch(
          readme_urls[i]
          // readme_urls[i].includes('raw.githubusercontent.com')
          //   ? readme_urls[i]
          //   : // use proxy as most servers produce a CORS error
          //     `/git_proxy/readme/${encodeURIComponent(readme_urls[i])}`
        );
        if (res.ok) {
          text = await res.text();
          break;
        } else {
          continue;
        }
      } catch {
        continue;
      }
    }
  } catch {
  }
  update(text);
};
const summary_defaults = {
  type: "proposal",
  title: "",
  descritpion: "",
  repo_a: "",
  id: "",
  comments: 0,
  status: void 0,
  status_date: 0,
  author: { ...defaults },
  created_at: 0,
  loading: true
};
const full_defaults = {
  summary: { ...summary_defaults },
  proposal_event: void 0,
  labels: [],
  events: [],
  loading: true
};
export {
  defaults as A,
  reply_kind as B,
  getName as C,
  full_defaults as D,
  awaitSelectedRepoCollection as E,
  selectRepoFromCollection as F,
  extractPatchMessage as G,
  proposal_status_kinds as H,
  extractIssueTitle as I,
  extractIssueDescription as J,
  event_defaults as K,
  returnRepoCollection as L,
  extractTagContent as M,
  isCoverLetter as N,
  parseContent as O,
  isParsedNewLine as P,
  isParsedLink as Q,
  isImage as R,
  isParsedNpub as S,
  isParsedNprofile as T,
  isParsedNevent as U,
  isParsedNote as V,
  isParsedNaddr as W,
  isParsedText as X,
  repo_kind as a,
  base_relays as b,
  aToNaddr as c,
  eventToRepoEvent as d,
  ensureRepo as e,
  ensureRepoCollection as f,
  extractAReference as g,
  repoCollectionToSummary as h,
  issue_kind as i,
  selected_repo_readme as j,
  selected_repo_event as k,
  proposal_status_open as l,
  proposal_status_applied as m,
  ndk as n,
  proposal_status_closed as o,
  patch_kind as p,
  statusKindtoText as q,
  repoEventToSummary as r,
  summary_defaults$1 as s,
  naddrToRepoA as t,
  ensureSelectedRepoCollection as u,
  selected_repo_collection as v,
  neventOrNoteToHexId as w,
  proposal_status_draft as x,
  naddrToPointer as y,
  summary_defaults as z
};
