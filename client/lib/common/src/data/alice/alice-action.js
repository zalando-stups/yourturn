import * as types from './alice-action-types';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetched(serverCountData) {
    return {
        type: types.FETCHED_SERVER_COUNT,
        serverCountData
    };
}

function fetching() {
    return {
        type: types.BEGIN_FETCH_SERVER_COUNT
    };
}

function failed(error) {
    return {
        type: types.FAIL_FETCH_SERVER_COUNT,
        error
    };
}

export function fetchServerCount(applicationId, startDate, endDate) {
    return function(dispatch) {
        let url = `${Services.alice.url}${Services.alice.root}instance-count/${applicationId}`;
        if (startDate) {
            url = url + `?from=${startDate}`;
        }
        if (endDate) {
            if (startDate) {
                url = url + '&';
            } else {
                url = url + '?';
            }
            url = url + `to=${endDate}`;
        }
        dispatch(fetching());
        request
            .get(url)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => {
                dispatch(fetched(res.body))
            }, err => {
                const {statusText, statusCode} = err.response;
                dispatch(failed(`${statusCode}: ${statusText}`));
            });
    };
}

