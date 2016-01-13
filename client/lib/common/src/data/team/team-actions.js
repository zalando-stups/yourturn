/* global ENV_DEVELOPMENT */
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import {createAction} from 'redux-actions';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import Type from './team-types';

function fetchAccounts() {
    return request
        .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/accounts`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

function fetchTeams() {
    return request
        .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/teams`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

function fetchTeam(team) {
    return request
        .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/teams/${team}`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

let fetchAccAction = flummoxCompatWrap(createAction(Type.FETCH_ACCOUNTS, fetchAccounts)),
    fetchTeamsAction = createAction(Type.FETCH_TEAMS, fetchTeams),
    fetchTeamAction = createAction(Type.FETCH_TEAM, fetchTeam);

export {
    fetchAccAction as fetchAccounts,
    fetchTeamsAction as fetchTeams,
    fetchTeamAction as fetchTeam
};
