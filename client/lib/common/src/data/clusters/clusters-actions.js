import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import {createAction} from 'redux-actions';
import Type from './clusters-types';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchAllClusters(resourceId) {
  
  return request
          .get(`${Services.clusters.url}${Services.clusters.root}?lifecycle_status=ready&verbose=false`)
          .accept('json')
          .oauth(Provider, RequestConfig)
          .exec(saveRoute)
          .then(res => [resourceId, res.body]);
}

let fetchClustersAction = flummoxCompatWrap(createAction(Type.FETCH_CLUSTERS, fetchAllClusters));

export {
    fetchClustersAction as fetchAllClusters
};
