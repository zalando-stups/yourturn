import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class TeamActions extends Actions {
    fetchTeams() {
        return request
                    .get('/teams')
                    .accept('json')
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .then(res => res.body);
    }

    fetchUserTeams(userId) {
        return request
                    .get(`/user/${userId}`)
                    .accept('json')
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .then(res => [userId, res.body])
                    .catch(e => {
                        e.id = userId;
                        throw e;
                    });
    }
}

export default TeamActions;
