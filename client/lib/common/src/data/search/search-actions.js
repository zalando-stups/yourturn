import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

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

function clearSearchResults(term) {
    return term;
}

class SearchActions extends Actions {
    fetchSearchResultsFrom(service, term) {
        return fetchSearchResultsFrom(service, term);
    }

    clearSearchResults(term) {
        return clearSearchResults(term);
    }

}

export default SearchActions;

export {
    fetchSearchResultsFrom,
    clearSearchResults
};