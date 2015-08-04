import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class PieroneActions extends Actions {

    fetchScmSource(team, artifact, tag) {
        return request
                .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags/${tag}/scm-source`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [team, artifact, tag, res.body])
                .catch(err => {
                    err.team = team;
                    err.artifact = artifact;
                    err.tag = tag;
                    throw err;
                });
    }

    fetchTags(team, artifact) {
        return request
                .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [team, artifact, res.body])
                .catch(err => {
                    err.team = team;
                    err.artifact = artifact;
                    throw err;
                });
    }
}

export default PieroneActions;
