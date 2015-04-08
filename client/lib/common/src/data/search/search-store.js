import {Store} from 'flummox';
import {Services, constructLocalUrl} from 'common/src/data/services';
import _m from 'mori';

function inverseSort(a, b) {
    return  a < b ? 1 :
                b < a ? -1 :
                    0;
}

class ApiStore extends Store {
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

    receiveSearchResultsFrom(results) {
        const TERM = results._term;
        const SOURCE = results._source;
        // check if term exists in state
        const EXISTS = _m.get( this.state.results, TERM) !== null;
        // if not, make it a new seq
        let old = EXISTS ? _m.get(this.state.results, TERM) : _m.vector();
        // convert results in vector
        let newResults = _m.toClj(results);
        newResults = _m.map(res => _m.assoc(res, '_source', SOURCE), newResults );
        newResults = _m.map(
            res => _m.assoc(
                        res,
                        '_url',
                        constructLocalUrl(SOURCE, _m.get( res, Services[SOURCE].id ))),
            newResults);
        // append results in seq
        old = _m.into( old, newResults );
        // sort seq by matched_rank
        old = _m.sortBy( res => _m.get(res, 'matched_rank'), inverseSort, old );
        // PROFIT
        this.setState({
            results: _m.assoc( this.state.results, TERM, old )
        });
    }

    getSearchResults(term) {
        return _m.toJs( _m.get( this.state.results, term ) ) || [];
    }

    hasResults(term) {
        return _m.get(this.state.results, term) !== null;
    }
}

export default ApiStore;