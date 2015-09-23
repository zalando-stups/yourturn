function getAccounts(state) {
    return state
            .sortBy(a => a.get('name').toLowerCase())
            .toJS();
}

export {
    getAccounts as getAccounts
};