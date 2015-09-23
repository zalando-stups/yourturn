/* globals expect */
import SearchStoreWrapper, {SearchStore} from 'common/src/data/search/search-store';
import SearchActions from 'common/src/data/search/search-actions';
import Types from 'common/src/data/search/search-types';
import {Flummox} from 'flummox';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('search', SearchActions);
        this.createStore('search', SearchStoreWrapper, this);
    }
}

describe('The search store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('search');
    });

    afterEach(() => {
        store.clearSearchResults('test');
    });

    it('should receive results', () => {
        let results = [{
            matched_rank: 1
        }, {
            matched_rank: 2
        }];
        results._term = 'test';
        results._source = 'twintip';
        store.receiveSearchResultsFrom(results);
        expect(store.hasResults('test')).to.be.true;
    });

    it('should sort results by matched_rank', () => {
        let results = [{
            matched_rank: 1,
            id: 'test1'
        }, {
            matched_rank: 2,
            id: 'test2'
        }];
        results._term = 'test';
        results._source = 'twintip';
        store.receiveSearchResultsFrom(results);
        let receivedResults = store.getSearchResults('test');

        expect(receivedResults.length).to.equal(2);
        expect(receivedResults[0].matched_rank).to.equal(2);
        expect(receivedResults[1].matched_rank).to.equal(1);
    });
});

describe('The search redux store', () => {
    it('should receive results', () => {
        let results = [{
                matched_rank: 1
            }, {
                matched_rank: 2
            }];
        results._term = 'test';
        results._source = 'twintip';
        let state = SearchStore(SearchStore(), {
            type: Types.RECEIVE_SEARCH_RESULTS,
            payload: results
        });
        expect(state.has('test')).to.be.true;
    });

    it('should sort results by matched_rank', () => {
        let results = [{
            matched_rank: 1,
            id: 'test1'
        }, {
            matched_rank: 2,
            id: 'test2'
        }];
        results._term = 'test';
        results._source = 'twintip';
        let state = SearchStore(SearchStore(), {
                type: Types.RECEIVE_SEARCH_RESULTS,
                payload: results
            }),
            receivedResults = state.get('test').toJS();

        expect(receivedResults.length).to.equal(2);
        expect(receivedResults[0].matched_rank).to.equal(2);
        expect(receivedResults[1].matched_rank).to.equal(1);
    });
});