import {Store} from 'flummox';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';
import FetchResult from 'common/src/fetch-result';

class PieroneStore extends Store {
    constructor(flux) {
        super();

        const pieroneActions = flux.getActions('pierone');

        this.state = {
            scmSources: _m.hashMap()
        };

        this.registerAsync(
            pieroneActions.fetchScmSource,
            this.beginFetchScmSource,
            this.receiveScmSource,
            this.failFetchScmSource);
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
            scmSources: _m.assocIn(this.state.scmSources, [team, artifact, tag], new Pending())
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
            // not found, just set to false
            this.setState({
                scmSources: _m.assocIn(this.state.scmSources, [team, artifact, tag], false)
            });
            return;
        }
        this.setState({
            scmSources: _m.assocIn(this.state.scmSources, [team, artifact, tag], new Failed(err))
        });
    }

    receiveScmSource([team, artifact, tag, scmSource]) {
        this.setState({
            scmSources: _m.assocIn(this.state.scmSources, [team, artifact, tag], _m.toClj(scmSource))
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
        let exists = _m.getIn(this.state.scmSources, [team, artifact, tag]);
        if (exists instanceof FetchResult) {
            return exists;
        }
        if (exists && exists !== false) {
            return _m.toJs(exists);
        }
        return false;
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.state = {
            scmSources: _m.hashMap()
        };
    }
}

export default PieroneStore;
