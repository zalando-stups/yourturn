import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class TeamActions extends Actions {
    fetchTeams() {
        return request
                    .get(`${Services.team.url}${Services.team.root}`)
                    .accept('json')
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .then(res => res.body);
    }

    fetchUserTeams(userId) {
        return request
                    .get(`${Services.team.url}/user/${userId}`)
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
