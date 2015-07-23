/* globals Promise */
function validateResponse(flux) {
    var ACTIONS = flux.getActions('user'),
        STORE = flux.getStore('user');
    return new Promise((resolve, reject) => {
        // 1) go to tokeninfo endpoint, get uid
        ACTIONS
            .fetchTokenInfo()
            .then(() => {
                let tokeninfo = STORE.getTokenInfo();
                // 2) validate that uid is present and realm is employees
                if (!tokeninfo.uid) {
                    return reject(new Error('No uid present on access token.'));
                }
                if (!tokeninfo.realm) {
                    return reject(new Error('No realm present on access token.'));
                }
                if (tokeninfo.realm !== 'employees' && tokeninfo.realm !== '/employees') {
                    return reject(new Error('Access token does not originate from "employees" realm.'));
                }
                // 3) fetch teams from team service
                var {uid} = tokeninfo;

                ACTIONS
                .fetchAccounts(uid)
                .then(() => {
                    let accounts = STORE.getUserCloudAccounts();
                    // 4) validate that at least one team exists
                    if (!accounts || !accounts.length) {
                        return reject(new Error('User does not have access to any AWS account.'));
                    }
                    return resolve();
                })
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

export default validateResponse;
