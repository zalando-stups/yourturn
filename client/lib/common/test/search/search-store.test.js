/* globals expect */
import Store from 'common/src/data/search/search-store';
import Types from 'common/src/data/search/search-types';
import * as Getter from 'common/src/data/search/search-getter';

describe('The redux search store', () => {
    it('should receive results', () => {
        let results = [{
                matched_rank: 1
            }, {
                matched_rank: 2
            }];
        results._term = 'test';
        results._source = 'twintip';
        let state = Store(Store(), {
            type: Types.FETCH_SEARCH_RESULTS,
            payload: results
        });
        expect(Getter.hasResults(state, 'test')).to.be.true;
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
        let state = Store(Store(), {
                type: Types.FETCH_SEARCH_RESULTS,
                payload: results
            }),
            receivedResults = Getter.getSearchResults(state, 'test');

        expect(receivedResults.twintip).to.be.defined;
        expect(receivedResults.twintip[0].matched_rank).to.equal(2);
        expect(receivedResults.twintip[1].matched_rank).to.equal(1);
    });
});