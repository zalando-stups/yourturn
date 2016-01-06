/* global ENV_DEVELOPMENT */
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import {createAction} from 'redux-actions';
import Type from './team-types';

function fetchAccounts() {
    return request
        .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/accounts`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

let fetchAction = createAction(Type.FETCH_ACCOUNTS, fetchAccounts);

export {
    fetchAction as fetchAccounts
};
