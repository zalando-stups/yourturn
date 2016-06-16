import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {createAction} from 'redux-actions';
import Type from './magnificent-types';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchAuth(team, policy='relaxed-radical-agility') {
    return request
            .get(`${Services.magnificent.url}/auth`)
            .type('json')
            .send({
                policy,
                payload: {team}
            })
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(_ => ({
                team,
                allowed: true
            }))
            .catch(err => {
                if (err.status === 403) {
                    return {
                        team,
                        allowed: false
                    };
                }
                err.team = team;
                throw err;
            });
}

let fetchAction = flummoxCompatWrap(createAction(Type.FETCH_AUTH, fetchAuth));

export {
    fetchAction as fetchAuth
};
