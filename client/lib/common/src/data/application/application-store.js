import {Store} from 'flummox';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';
import FetchResult from 'common/src/fetch-result';

class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const appActions = flux.getActions('application');

        this.state = {
            applications: _m.hashMap()
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
    }

    // intentionally left as noop for now
    beginFetchApplications() {}
    failFetchApplications() {}

    /**
     * Replaces application with `id` with a Pending state.
     *
     * @param  {string} id
     */
    beginFetchApplication( id ) {
        this.setState({
            applications: _m.assoc( this.state.applications, id, new Pending() )
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
     * Adds applications to store. Overwrites applications with the same id.
     *
     * @param  {array} apps
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
     * Adds single application to store. Just calls `receiveApplications` underneath.
     *
     * @param  {object} app
     */
    receiveApplication( app ) {
        this.receiveApplications([ app ]);
    }

    /**
     * Returns all applications that are available (as in not Pending or Failed) RIGHT NAO!
     *
     * @return {array} Available applications
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
     * @param  {string} id
     * @return {object} The application with this id
     */
    getApplication(id) {
        let app = _m.get( this.state.applications, id );
        return _m.toJs(app);
    }
}

export default ApplicationStore;