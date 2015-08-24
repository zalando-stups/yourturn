import {Store} from 'flummox';
import {Services, getLocalUrlForService} from 'common/src/data/services';
import Immutable from 'immutable';

function sortDesc(a, b) {
    return a < b ? 1 :
                b < a ? -1 :
                    0;
}

class SearchStore extends Store {
    constructor(flux) {
        super();

        const searchActions = flux.getActions('search');

        this.state = {
            results: Immutable.Map()
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
            results: this.state.results.delete(term)
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
        const TERM = resultSet._term,
            SOURCE = resultSet._source;
        let {results} = this.state,
            newState = Immutable
                        .fromJS(resultSet)
                        .map(res => res.set('_source', SOURCE))
                        .map(res => res.set('_url', getLocalUrlForService(SOURCE, res.get(Services[SOURCE].id))))
                        .concat(results.get(TERM, Immutable.List()))
                        .sortBy(res => res.get('matched_rank'), sortDesc);
        this.setState({
            results: this.state.results.set(TERM, newState)
        });
    }

    /**
     * Returns the available search results for `term`.
     *
     * @param  {String} term
     * @return {Array} Is empty if no results are available.
     */
    getSearchResults(term) {
        let results = this.state.results.get(term);
        return results ? results.toJS() : [];
    }

    /**
     * Returns true if there is an entry for `term`. Might
     * be empty though.
     *
     * @param  {String}  term
     * @return {Boolean} True if `term` is associated with the underlying hashmap.
     */
    hasResults(term) {
        return this.state.results.has(term);
    }
}

export default SearchStore;
