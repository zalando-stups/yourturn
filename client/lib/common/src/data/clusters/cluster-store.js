import Immutable from 'immutable';
import Types from './clusters-types';
import {Pending, Failed} from 'common/src/fetch-result';

function ClusterStore(state = Immutable.Map(), action) {
  if (!action) {
    return state;
  }

  let {type, payload} = action;
  
      if (type === Types.FETCH_CLUSTERS) {
        const list = payload[1].items.reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), Immutable.Map());
        state.set(list);
        return list;
      }/* else if (type === Types.BEGIN_FETCH_CLUSTERS){
        let [resource, clusters] = payload;
        return state.setIn([resource, clusters], new Pending());
      } else if (type === Types.FAIL_FETCH_CLUSTERS) {
        let [resource, clusters] = payload;
        return state.set([resource, clusters], new Failed(payload));
      }*/
    return state;
}

export default ClusterStore;