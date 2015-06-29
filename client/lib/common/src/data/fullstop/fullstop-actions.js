import FULLSTOP_BASE_URL from 'FULLSTOP_BASE_URL';
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class FullstopActions extends Actions {
    fetchViolations(accounts) {
        return request
                .get(`${FULLSTOP_BASE_URL}/violations`)
                .accept('json')
                .query({
                    accounts: accounts,
                    size: 500
                })
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body.content);
    }

    fetchViolation(violationId) {
        return request
                .get(`${FULLSTOP_BASE_URL}/violations/${violationId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(e => {
                    e.violationId = violationId;
                    throw e;
                });
    }

    resolveViolation(violationId, message) {
        return request
                .post(`${FULLSTOP_BASE_URL}/violations/${violationId}/resolution`)
                .accept('json')
                .type('text/plain')
                .send(message)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }
}

export default FullstopActions;