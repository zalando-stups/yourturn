import {Store} from 'flummox';
import {Services, getLocalUrlForService} from 'common/src/data/services';
import Immutable from 'immutable';
import Types from './search-types';
import * as Getter from './search-getter';

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

    if (type === Types.RECEIVE_SEARCH_RESULTS) {
        let {_term, _source} = payload,
            newState = Immutable
                        .fromJS(payload)
                        .map(res => res.set('_source', _source))
                        .map(res => res.set('_url', getLocalUrlForService(_source, res.get(Services[_source].id))))
                        .concat(state.get(_term, Immutable.List()))
                        .sortBy(res => res.get('matched_rank'), sortDesc);
        return state.set(_term, newState);
    } else if (type === Types.CLEAR_SEARCH_RESULTS) {
        return state.delete(payload);
    }

    return state;
}

export {
    SearchStore
};

class SearchStoreWrapper extends Store {
    constructor(flux) {
        super();

        const searchActions = flux.getActions('search');

        this.state = {
            redux: SearchStore()
        };

        this.register(searchActions.clearSearchResults, this.clearSearchResults);

        this.registerAsync(
            searchActions.fetchSearchResultsFrom,
            null,
            this.receiveSearchResultsFrom,
            this.failFetchSearchResultsFrom);
    }

    /**
     * Removes search results for `term`.
     *
     * @param  {String} term
     */
    clearSearchResults(term) {
        this.setState({
            redux: SearchStore(this.state.redux, {
                type: Types.CLEAR_SEARCH_RESULTS,
                payload: term
            })
        });
    }

    failFetchSearchResultsFrom() {
        // emit change event even though nothing actually changed
        // so views can render "no results found"
        this.forceUpdate();
    }

    /**
     * Adds the results to the existing search results for the
     * respective search term. Creates a new entry if none is
     * available.
     *
     * @param  {Array} resultSet
     */
    receiveSearchResultsFrom(resultSet) {
        this.setState({
            redux: SearchStore(this.state.redux, {
                type: Types.RECEIVE_SEARCH_RESULTS,
                payload: resultSet
            })
        });
    }

    /**
     * Returns the available search results for `term`.
     *
     * @param  {String} term
     * @return {Array} Is empty if no results are available.
     */
    getSearchResults(term) {
        return Getter.getSearchResults(this.state.redux, term);
    }

    /**
     * Returns true if there is an entry for `term`. Might
     * be empty though.
     *
     * @param  {String}  term
     * @return {Boolean} True if `term` is associated with the underlying hashmap.
     */
    hasResults(term) {
        return Getter.hasResults(this.state.redux, term);
    }
}

export default SearchStoreWrapper;
