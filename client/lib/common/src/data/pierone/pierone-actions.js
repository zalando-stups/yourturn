import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchScmSource(team, artifact, tag) {
    return request
            .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags/${tag}/scm-source`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [team, artifact, tag, res.body])
            .catch (err => {
                err.team = team;
                err.artifact = artifact;
                err.tag = tag;
                throw err;
            });
}

function fetchTags(team, artifact) {
    return request
            .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [team, artifact, res.body])
            .catch (err => {
                err.team = team;
                err.artifact = artifact;
                throw err;
            });
}

class PieroneActions extends Actions {

    fetchScmSource(team, artifact, tag) {
        return fetchScmSource(team, artifact, tag);
    }

    fetchTags(team, artifact) {
        return fetchTags(team, artifact);
    }
}

export default PieroneActions;

export {
    fetchScmSource as fetchScmSource,
    fetchTags as fetchTags
};