import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';

class PieroneStore extends Store {
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
            this.beginFetchTags,
            this.receiveTags,
            this.failFetchTags);
    }

    beginFetchTags() { }
    failFetchTags() { }

    receiveTags([team, artifact, tags]) {
        this.setState({
            tags: this.state.tags.setIn([team, artifact], Immutable.fromJS(tags))
        });
    }

    getTags(team, artifact) {
        return this.state.tags.getIn([team, artifact], Immutable.List()).toJS();
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
            scmSources: this.state.scmSources.setIn([team, artifact, tag], new Pending())
        });
    }

    /**
     * Sets `false` if if was a 404 error, else a Failed result
     * with the error information.
     *
     * @param  {Error} err
     */
    failFetchScmSource(err) {
        let {team, artifact, tag} = err;
        if (err.status === 404) {
            return this.setState({
                scmSources: this.state.scmSources.setIn([team, artifact, tag], false)
            });
        }
        this.setState({
            scmSources: this.state.scmSources.setIn([team, artifact, tag], new Failed(err))
        });
    }

    receiveScmSource([team, artifact, tag, scmSource]) {
        this.setState({
            scmSources: this.state.scmSources.setIn([team, artifact, tag], Immutable.fromJS(scmSource))
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
        let exists = this.state.scmSources.getIn([team, artifact, tag]);
        return exists ? exists.toJS() : false;
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.state = {
            scmSources: Immutable.Map(),
            tags: Immutable.Map()
        };
    }
}

export default PieroneStore;
