import {Store} from 'flummox';
import _m from 'mori';

class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const appActions = flux.getActions('application');

        this.state = {
            applications: _m.vector()
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

    beginFetchApplications() {
        console.log('[store] fetching apps' );
    }

    beginFetchApplication() {}

    failFetchApplications(err) {
        console.error( err );
    }

    failFetchApplication(err) {
        console.error(err);
    }

    receiveApplications( apps ) {
        this.setState({
            applications: _m.into( this.state.applications, _m.toClj(apps) )
        });
    }

    receiveApplication( app ) {
        this.receiveApplications([ app ]);
    }

    getApplications() {
        return _m.toJs(this.state.applications);
    }

    getApplication(id) {
        let app = _m.first( _m.filter( app => app.id === id, this.state.applications ) );
        return _m.toJs(app);
    }
}

export default ApplicationStore;