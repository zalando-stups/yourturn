function getAccounts(state) {
    return state
            .sortBy(a => a.get('name').toLowerCase())
            .toJS();
}

function getAccount(state, id) {
    let result = state
                    .filter(a => a.get('id') === id)
                    .toJS();
    return result.length ? result[0] : null;
}

export {
    getAccounts,
    getAccount
};