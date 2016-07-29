import * as types from './alice-action-types';
// import Api from '../api/Api';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchedServerCount(serverCountData) {
    return {
        type: types.FETCHED_SERVER_COUNT,
        serverCountData
    };
}

export function fetchServerCount(applicationId, startDate, endDate) {
    return function(dispatch) {
        console.log("fetchServerCount called %O", applicationId);
        const serverCountData = [{x:1, y:2}];
        const url = `${Services.alice.url}${Services.alice.root}servercount/${applicationId}`;
        console.log("url to call %O", url);
        request
            .get(url)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => {
                console.log("res body %O", res.body);
                dispatch(fetchedServerCount(res.body))
            });
    };
}

