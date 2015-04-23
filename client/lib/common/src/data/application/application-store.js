import {Store} from 'flummox';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';
import FetchResult from 'common/src/fetch-result';

class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const appActions = flux.getActions('application');

        this.state = {
            applications: _m.hashMap(),
            versions: _m.hashMap()
        };

        this.registerAsync(
            appActions.fetchApplications,
            this.beginFetchApplications,
            this.receiveApplications,
            this.failFetchApplications);

        this.registerAsync(
            appActions.fetchApplication,
            this.beginFetchApplication,
            this.receiveApplication,
            this.failFetchApplication);

        this.registerAsync(
            appActions.saveApplication,
            this.beginSaveApplication,
            this.receiveApplication,
            this.failSaveApplication);

        this.registerAsync(
            appActions.fetchApplicationVersions,
            this.beginFetchApplicationVersions,
            this.receiveApplicationVersions,
            this.failFetchApplications);

        this.registerAsync(
            appActions.fetchApplicationVersion,
            this.beginFetchApplicationVersion,
            this.receiveApplicationVersion,
            this.failFetchApplicationVersion);

    }

    // intentionally left as noop for now
    beginFetchApplications() {}
    failFetchApplications() {}

    beginSaveApplication() {}
    failSaveApplication() {}

    beginFetchApplicationVersions() {}
    failFetchApplicationVersions() {}

    /**
     * Replaces application with `id` with a Pending state.
     *
     * @param  {String} id
     */
    beginFetchApplication( id ) {
        this.setState({
            applications: _m.assoc( this.state.applications, id, new Pending() )
        });
    }

    /**
     * Replaces application with `id` and version `ver` with a Pending state.
     *
     * @param  {String} id
     * @param  {String} ver
     */
    beginFetchApplicationVersion( id, ver ) {
        let updatedApp = _m.assoc( _m.get(this.state.versions, id) || _m.hashMap(), ver, new Pending() );
        this.setState({
            versions: _m.assoc(this.state.versions, id, updatedApp)
        });
    }


    /**
     * Replaces application with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplication(err) {
        this.setState({
            applications: _m.assoc( this.state.applications, err.id, new Failed( err ) )
        });
    }

    /**
     * Replaces application version with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplicationVersion(err) {
        let updatedVer =  _m.assoc( _m.get(this.state.versions, err.id), err.ver, new Failed( err ) );
        this.setState({
            versions:  _m.assoc(this.state.versions, err.id, updatedVer)
        });
    }

    /**
     * Adds applications to store. Overwrites applications with the same id.
     *
     * @param  {Array} apps
     */
    receiveApplications( apps ) {
        let newState = apps.reduce(
                            (map, app) => _m.assoc( map, app.id, _m.toClj( app )),
                            _m.hashMap() );
        this.setState({
            applications: _m.merge( this.state.applications, newState )
        });
    }

    /**
     * Adds application versions to store.
     *
     * @param  {Array} versions
     */
    receiveApplicationVersions( versions ) {
        let newState = versions.reduce(
                            (map, ver) => {
                                let app = _m.get(map, ver.application_id);
                                if (!app) {
                                    app = _m.hashMap();
                                }
                                app = _m.assoc(app, ver.id, _m.toClj(ver));
                                return _m.assoc(map, ver.application_id, app);
                            },
                            this.state.versions);
        this.setState({
            versions: newState
        });
    }

    /**
     * Adds single application to store. Just calls `receiveApplications` underneath.
     *
     * @param  {object} app
     */
    receiveApplication( app ) {
        this.receiveApplications([ app ]);
    }

    /**
     * Adds single application version to store. Just calls `receiveApplicationVersions` underneath.
     *
     * @param  {object} ver
     */
    receiveApplicationVersion( ver ) {
        this.receiveApplicationVersions([ ver ]);
    }


    /**
     * Returns all applications that are available (as in not Pending or Failed) RIGHT NAO!
     *
     * @return {Array} Available applications
     */
    getApplications() {
        let availableApps = _m.filter( app => !(app instanceof FetchResult), _m.vals( this.state.applications ) );
        let sortedApps = _m.sort( a => _m.get(a, 'name'), availableApps);
        return _m.toJs( sortedApps ) || [];
    }

    /**
     * Returns the application with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed. Returns null if there is no application with this id.
     *
     * @param  {String} id
     * @return {object} The application with this id
     */
    getApplication(id) {
        let app = _m.get( this.state.applications, id );
        return app ? _m.toJs(app) : false;
    }

    /**
     * Returns all versions for a given application
     *
     * @return {Array} Available applications
     */
    getApplicationVersions(id) {
        let versions = _m.vals(_m.get(this.state.versions, id)),
            sorted = _m.sort(v => _m.get(v, 'id'), versions);
        return _m.toJs( sorted ) || [];
    }


    /**
     * Returns the application version with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed. Returns null if there is no version with this id.
     *
     * @param  {String} id
     * @param  {String} ver
     * @return {object} The application version with this id and ver
     */
    getApplicationVersion(id, ver) {
        let app = _m.get( this.state.versions, id );
        if (app) {
            let version = _m.get(app, ver);
            return version ? _m.toJs(version) : false;
        }
    }


    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            applications: _m.hashMap()
        });
    }
}

export default ApplicationStore;
