import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class SearchActions extends Actions {

    /**
     * Does not actually fetch anything, but
     * triggers a `fetchSearchResultsFrom` for
     * every known service.
     *
     * @param  {String} term
     */
    fetchSearchResults(term) {
        Object
            .keys(Services)
            .forEach(key => this.fetchSearchResultsFrom(key, term));
    }

    clearSearchResults(term) {
        return term;
    }

    /**
     * Fetches a search query from the specified service.
     *
     * @param  {String} service The service id as specified in common/data/services.js
     * @param  {String} term
     * @return {Promise}         [description]
     */
    fetchSearchResultsFrom(service, term) {
        return request
                .get(`${Services[service].url}${Services[service].root}`)
                .query({search: term})
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => {
                    let body = res.body;
                    body._term = term;
                    body._source = service;
                    return body;
                });
    }
}

export default SearchActions;