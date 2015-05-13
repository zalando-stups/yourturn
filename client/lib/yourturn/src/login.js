/* globals Promise */

class LoginHandler {
    constructor(flux) {
        this.flux = flux;
        this.actions = {
            team: flux.getActions('team'),
            tokeninfo: flux.getActions('tokeninfo')
        };
        this.store = {
            team: flux.getStore('team'),
            tokeninfo: flux.getStore('tokeninfo')
        };
    }

    validateResponse(oauthResponse) {
        return new Promise((resolve, reject) => {
            // 1) go to tokeninfo endpoint, get uid
            var {access_token} = oauthResponse;
            this.actions
                .tokeninfo
                .fetchTokenInfo(access_token)
                .then(() => {
                    let tokeninfo = this.store.tokeninfo.getTokenInfo(access_token);
                    // 2) validate that uid is present and realm is employees
                    if (!tokeninfo.uid) {
                        return reject(new Error('No uid present on access token.'));
                    }
                    if (!tokeninfo.realm) {
                        return reject(new Error('No realm present on access token.'));
                    }
                    if (tokeninfo.realm !== 'employees') {
                        return reject(new Error('Access token does not originate from "employees" realm.'));
                    }
                    // 3) fetch teams from team service
                    var {uid} = tokeninfo;
                    this
                    .actions
                    .team
                    .fetchUserTeams(uid)
                    .then(() => {
                        let teams = this.store.team.getUserTeams(uid);
                        // 4) validate that at least one team exists
                        if (!teams || !teams.length) {
                            return reject(new Error('User is not part of a team.'));
                        }
                        return resolve();
                    })
                    .catch(e => {
                        reject(e);
                    });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

export default LoginHandler;