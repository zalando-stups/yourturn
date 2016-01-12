/* globals Promise */
function validateResponse(userActions) {
    return new Promise((resolve, reject) => {
        // 1) go to tokeninfo endpoint, get uid
        userActions
            .fetchTokenInfo()
            .then(tokeninfo => {
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

                resolve(tokeninfo);
            })
            .catch(e => reject(e));
    });
}

export default validateResponse;
