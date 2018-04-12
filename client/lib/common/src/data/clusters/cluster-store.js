import Immutable from 'immutable';
import Types from './clusters-types';

function ClusterStore(state = Immutable.Map(), action) {
  if (!action) {
    return state;
  }

  let {type, payload} = action;
  
      if (type === Types.FETCH_CLUSTERS) {
        const list = payload[1].items.reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), Immutable.Map());
        state.set(list);
        return list;
      }
    return state;
}

export default ClusterStore;