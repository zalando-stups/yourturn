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
                    accounts: accounts
                })
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }

    fetchViolation(violationId) {
        return request
                .get(`${FULLSTOP_BASE_URL}/violations/${violationId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }

    resolveViolation(violationId, violation, comment) {
        violation.checked = true;
        violation.comment = comment;
        return request
                .put(`${FULLSTOP_BASE_URL}/violations/${violationId}`)
                .accept('json')
                .type('json')
                .send(violation)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(() => this.fetchViolation(violationId));
    }
}

export default FullstopActions;