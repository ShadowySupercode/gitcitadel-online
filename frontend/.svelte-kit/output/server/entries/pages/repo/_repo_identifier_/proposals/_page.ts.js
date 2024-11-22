import { r as redirect } from "../../../../../chunks/index.js";
const load = ({ params }) => {
  throw redirect(301, `/repo/${params.repo_identifier}`);
};
export {
  load
};
