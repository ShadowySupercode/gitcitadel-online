const load = ({
  params
}) => {
  return {
    repo_naddr: decodeURIComponent(params.repo_naddr),
    proposal_nip19: params.proposal_nip19
  };
};
export {
  load
};
