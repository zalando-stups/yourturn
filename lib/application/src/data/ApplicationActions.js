import {Actions} from 'flummox';
import request from 'common/src/superagent';
import config from '../config';

const {BASE_URL} = config;

export default class ApplicationActions extends Actions {
    /**
     * Fetches a single application.
     * @param  {string|number} id The id of the application to fetch.
     * @return {Promise} Promise that resolves when the request is done.
     */
    getApplication(id) {
        return request
                .get(`${BASE_URL}/applications/${id}`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }

    /**
     * Fetches all applications.
     * @return {Promise} Promise that resolves when the request is done.
     */
    getApplications() {
        return request
                .get(`${BASE_URL}/applications`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }
}