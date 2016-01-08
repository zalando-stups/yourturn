import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import {createAction} from 'redux-actions';
import Type from './pierone-types';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';

function fetchScmSource(team, artifact, tag) {
    return request
            .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags/${tag}/scm-source`)
            .accept('json')
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

function fetchTags(team, artifact) {
    return request
            .get(`${Services.pierone.url}/teams/${team}/artifacts/${artifact}/tags`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [team, artifact, res.body])
            .catch(err => {
                err.team = team;
                err.artifact = artifact;
                throw err;
            });
}

let fetchScmAction = flummoxCompatWrap(createAction(Type.FETCH_SCM_SOURCE, fetchScmSource)),
    fetchTagsAction = createAction(Type.FETCH_TAGS, fetchTags);

export {
    fetchScmAction as fetchScmSource,
    fetchTagsAction as fetchTags
};