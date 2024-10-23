import { A as defaults } from "./type.js";
const summary_defaults = {
  type: "issue",
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
  issue_event: void 0,
  labels: [],
  events: [],
  loading: true
};
export {
  full_defaults as f,
  summary_defaults as s
};
