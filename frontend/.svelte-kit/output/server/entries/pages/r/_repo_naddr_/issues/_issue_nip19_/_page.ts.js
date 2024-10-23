const load = ({
  params
}) => {
  return {
    repo_naddr: decodeURIComponent(params.repo_naddr),
    issue_nip19: params.issue_nip19
  };
};
export {
  load
};
