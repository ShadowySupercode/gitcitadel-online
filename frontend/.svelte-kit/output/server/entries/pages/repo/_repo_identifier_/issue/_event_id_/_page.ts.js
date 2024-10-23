import { r as redirect } from "../../../../../../chunks/index.js";
const load = ({ params }) => {
  throw redirect(301, `/e/${params.event_id}`);
};
export {
  load
};
