import * as types from './alice-action-types';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetched(instanceCountData) {
    return {
        type: types.FETCHED_INSTANCE_COUNT,
        instanceCountData
    };
}

function fetching() {
    return {
        type: types.BEGIN_FETCH_INSTANCE_COUNT
    };
}

function failed(error) {
    return {
        type: types.FAIL_FETCH_INSTANCE_COUNT,
        error
    };
}

export function fetchInstanceCount(applicationId, startDate, endDate) {
    return function(dispatch) {
        const parameter = {from: startDate, to: endDate};
        const urlParameterPart = Object.keys(parameter)
            .filter(key => parameter[key])
            .map(key => `${key}=${parameter[key].toISOString()}`)
            .join('&');

        const baseUrl = `${Services.alice.url}${Services.alice.root}instance-count/${applicationId}`;

        const completeUrl = urlParameterPart ? baseUrl + '?' + urlParameterPart : baseUrl;
        
        dispatch(fetching());
        request
            .get(completeUrl)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => {
                dispatch(fetched(res.body))
            }, err => {
                const {statusText, statusCode} = err.response;
                dispatch(failed({status: statusText, message: statusCode}));
            });
    };
}

