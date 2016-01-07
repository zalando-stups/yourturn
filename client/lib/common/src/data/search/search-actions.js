import request from 'common/src/superagent';
import {createAction} from 'redux-actions';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import Type from './search-types';

/**
 * Fetches a search query from the specified service.
 *
 * @param  {String} service The service id as specified in common/data/services.js
 * @param  {String} term
 * @return {Promise}         [description]
 */
function fetchSearchResultsFrom(service, term) {
    return request
            .get(`${Services[service].url}${Services[service].root}`)
            .query(`${Services[service].searchQuery}=${term}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => {
                let body = service === 'pierone' ? res.body.results : res.body;
                body._term = term;
                body._source = service;
                return body;
            });
}

let fetchAction = createAction(Type.FETCH_SEARCH_RESULTS, fetchSearchResultsFrom),
    clearAction = createAction(Type.CLEAR_SEARCH_RESULTS);

export {
    fetchAction as fetchSearchResultsFrom,
    clearAction as clearSearchResults
};