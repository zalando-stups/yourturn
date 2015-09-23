import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './pierone-types';
import * as Getter from './pierone-getter';

function PieroneStore(state = Immutable.fromJS({
    scmSources: {},
    tags: {}
}), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_SCM_SOURCE) {
        let [team, artifact, tag] = payload;
        return state.setIn(['scmSources', team, artifact, tag], new Pending());
    } else if (type === Types.FAIL_FETCH_SCM_SOURCE) {
        let {team, artifact, tag} = payload;
        if (payload.status === 404) {
            return state.setIn(['scmSources', team, artifact, tag], false);
        }
        return state.setIn(['scmSources', team, artifact, tag], new Failed(payload));
    } else if (type === Types.RECEIVE_SCM_SOURCE) {
        let [team, artifact, tag, scmSource] = payload;
        return state.setIn(['scmSources', team, artifact, tag], Immutable.fromJS(scmSource));
    } else if (type === Types.RECEIVE_TAGS) {
        let [team, artifact, tags] = payload;
        return state.setIn(['tags', team, artifact], Immutable.fromJS(tags));
    }

    return state;
}

export {
    PieroneStore as PieroneStore
};

class PieroneStoreWrapper extends Store {
    constructor(flux) {
        super();

        const pieroneActions = flux.getActions('pierone');

        this._empty();

        this.registerAsync(
            pieroneActions.fetchScmSource,
            this.beginFetchScmSource,
            this.receiveScmSource,
            this.failFetchScmSource);

        this.registerAsync(
            pieroneActions.fetchTags,
            null,
            this.receiveTags,
            null);
    }

    receiveTags([team, artifact, tags]) {
        this.setState({
            redux: PieroneStore(this.state.redux, {
                type: Types.RECEIVE_TAGS,
                payload: [team, artifact, tags]
            })
        });
    }

    getTags(team, artifact) {
        return Getter.getTags(this.state.redux, team, artifact);
    }

    /**
     * Sets a pending result for this scm-source.
     *
     * @param  {String} team
     * @param  {String} artifact
     * @param  {String} tag
     */
    beginFetchScmSource(team, artifact, tag) {
        this.setState({
            redux: PieroneStore(this.state.redux, {
                type: Types.BEGIN_FETCH_SCM_SOURCE,
                payload: [team, artifact, tag]
            })
        });
    }

    /**
     * Sets `false` if if was a 404 error, else a Failed result
     * with the error information.
     *
     * @param  {Error} err
     */
    failFetchScmSource(err) {
        this.setState({
            redux: PieroneStore(this.state.redux, {
                type: Types.FAIL_FETCH_SCM_SOURCE,
                payload: err
            })
        });
    }

    receiveScmSource([team, artifact, tag, scmSource]) {
        this.setState({
            redux: PieroneStore(this.state.redux, {
                type: Types.RECEIVE_SCM_SOURCE,
                payload: [team, artifact, tag, scmSource]
            })
        });
    }

    /**
     * Gets the scm-source information for a docker image.
     *
     * @param  {String} team
     * @param  {String} artifact
     * @param  {String} tag
     * @return {Object|false} scm-source JSON or false if not available
     */
    getScmSource(team, artifact, tag) {
        return Getter.getScmSource(this.state.redux, team, artifact, tag);
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.state = {
            redux: PieroneStore()
        };
    }
}

export default PieroneStoreWrapper;
