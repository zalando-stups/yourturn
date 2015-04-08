import {Store} from 'flummox';
import {Services, constructLocalUrl} from 'common/src/data/services';
import _m from 'mori';

function sortDesc(a, b) {
    return  a < b ? 1 :
                b < a ? -1 :
                    0;
}

class SearchStore extends Store {
    constructor(flux) {
        super();

        const searchActions = flux.getActions('search');

        this.state = {
            results: _m.hashMap()
        };

        this.register(searchActions.clearSearchResults, this.clearSearchResults);

        this.registerAsync(
            searchActions.fetchSearchResultsFrom,
            this.beginFetchSearchResultsFrom,
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
            results: _m.dissoc( this.state.results, term )
        });
    }

    beginFetchSearchResultsFrom() {}
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
     * @param  {Array} results
     */
    receiveSearchResultsFrom(results) {
        const TERM = results._term;
        const SOURCE = results._source;
        // check if term exists in state
        const EXISTS = _m.get( this.state.results, TERM) !== null;
        // if not, make it a new seq
        let old = EXISTS ? _m.get(this.state.results, TERM) : _m.vector();
        // convert results in vector
        let newResults = _m.toClj(results);
        // add a _source field so the view can display where this result came from
        newResults = _m.map(res => _m.assoc(res, '_source', SOURCE), newResults );
        // add a _url field so that we can link inside yourturn
        newResults = _m.map(
            res => _m.assoc(
                        res,
                        '_url',
                        constructLocalUrl(SOURCE, _m.get( res, Services[SOURCE].id ))),
            newResults);
        // append results in seq
        old = _m.into( old, newResults );
        // sort seq by matched_rank desc
        old = _m.sortBy( res => _m.get(res, 'matched_rank'), sortDesc, old );
        // PROFIT
        this.setState({
            results: _m.assoc( this.state.results, TERM, old )
        });
    }

    /**
     * Returns the available search results for `term`.
     *
     * @param  {String} term
     * @return {Array} Is empty if no results are available.
     */
    getSearchResults(term) {
        return _m.toJs( _m.get( this.state.results, term ) ) || [];
    }

    /**
     * Returns true if there is an entry for `term`. Might
     * be empty though.
     *
     * @param  {String}  term
     * @return {Boolean} True if `term` is associated with the underlying hashmap.
     */
    hasResults(term) {
        return _m.get(this.state.results, term) !== null;
    }
}

export default SearchStore;