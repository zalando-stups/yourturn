function requireTeam(flux) {
    const ACTIONS = flux.getActions('user'),
          STORE = flux.getStore('user');
    if (!STORE.getTeamMemberships().length) {
        let tokeninfo = STORE.getTokenInfo();
        if (!tokeninfo.uid) {
            return ACTIONS
                    .fetchTokenInfo()
                    .then(token => ACTIONS.fetchTeamMembership(token.uid))
                    .catch(() => ACTIONS.fetchAccessToken());
        }
        return ACTIONS.fetchTeamMembership(tokeninfo.uid);
    }
    return Promise.resolve(STORE.getTeamMemberships());
}

export {
    requireTeam as requireTeam
};
