import {Services, constructUrl} from 'common/src/data/services';
import Immutable from 'immutable';
import Types from './search-types';

function sortDesc(a, b) {
    return a < b ? 1 :
                b < a ? -1 :
                    0;
}

function SearchStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.FETCH_SEARCH_RESULTS) {
        let {_term, _source} = payload,
            newState = Immutable
                        .fromJS(payload)
                        .map(res => res.set('_source', _source))
                        .map(res => res.set('_url', constructUrl(_source, res.get(Services[_source].id))))
                        .concat(state.get(_term, Immutable.List()))
                        .sortBy(res => res.get('matched_rank'), sortDesc);
        return state.set(_term, newState);
    } else if (type === Types.CLEAR_SEARCH_RESULTS) {
        return state.delete(payload);
    }

    return state;
}

export default SearchStore;
