import {combineReducers} from 'redux';
import kubernetes_clusters from './cluster-store';

var ClustersStore = combineReducers({
    kubernetes_clusters
});

export default ClustersStore;
