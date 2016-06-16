import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {createAction} from 'redux-actions';
import Type from './magnificent-types';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchAuth(team, policy='relaxed-radical-agility') {
    return request
            .post(`${Services.magnificent.url}/auth`)
            .type('json')
            .oauth(Provider, RequestConfig)
            .send({
                policy,
                payload: {team}
            })
            .exec(saveRoute)
            .then(_ => ({
                team,
                allowed: true
            }))
            .catch(_ => ({team, allowed: false}));
}

let fetchAction = flummoxCompatWrap(createAction(Type.FETCH_AUTH, fetchAuth));

export {
    fetchAction as fetchAuth
};
