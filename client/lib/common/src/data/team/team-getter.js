function getAccounts(state) {
    return state
            .get('accounts')
            .sortBy(a => a.get('name').toLowerCase())
            .toJS();
}

function getAccount(state, id) {
    let result = state
                    .get('accounts')
                    .filter(a => a.get('id') === id)
                    .toJS();
    return result.length ? result[0] : null;
}

function getTeams(state) {
    const teams = state.get('teams').toJS();
    return Object.keys(teams).map(id => teams[id]);
}

function getTeam(state, id) {
    let team = state.getIn(['teams', id]);
    return team ? team.toJS() : false;
}

function getAlias(state, id) {
    return state.getIn(['alias', id], false);
}

function getAliase(state) {
    return state.get('alias').toJS();
}

export {
    getAccounts,
    getAccount,
    getTeam,
    getTeams,
    getAlias,
    getAliase
};
