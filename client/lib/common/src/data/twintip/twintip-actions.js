import {createAction} from 'redux-actions';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import request from 'common/src/superagent';
import Type from './twintip-types';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchApi(id) {
    return request
        .get(`${Services.twintip.url}${Services.twintip.root}/${id}`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body)
        .catch(err => {
            err.id = id;
            throw err;
        });
}

let fetchApiAction = flummoxCompatWrap(createAction(Type.FETCH_API, fetchApi));

export {
    fetchApiAction as fetchApi
};
