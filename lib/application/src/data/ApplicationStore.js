import {Store} from 'flummox';
import Immutable from 'immutable';
import {FLUX_ID} from '../config';
import {Failed, Pending} from 'common/src/FetchResult';

export default class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const applicationActions = flux.getActions(FLUX_ID);
        this.registerAsync(
            applicationActions.getApplication,
            this.beginReceiveApplication,
            this.receiveApplication,
            this.failReceiveApplication);

        this.registerAsync(
            applicationActions.getApplications,
            this.beginReceiveApplications,
            this.receiveApplications,
            this.failReceiveApplications);
        this.state = {
            applications: Immutable.Map()
        };
        this.buffer = null;
    }

    /**
     * Replaces the store state with a pending FetchResult, so that
     * a React Component using it knows that the state is
     * currently volatile. The state is written to an intermediate
     * variable and back once new applications come in.
     *
     */
    beginReceiveApplications() {
        this.buffer = this.state.applications;
        this.setState({
            applications: new Pending()
        });
    }

    /**
     * Fetching applications failed, so the store state is replaced
     * with a failed FetchResult.
     */
    failReceiveApplications(err) {
        this.setState({
            applications: new Failed(err)
        });
    }

    /**
     * Puts applications into the store.
     * @param  {array} apps The apps to add
     */
    receiveApplications(apps) {
        // transform array into map
        // then do a single setState
        // -> when we call setState once for every app only the last is persisted
        var map = apps.reduce(function(p, c) {
                        p[c.id] = c;
                        return p;
                    },
                    {}),
            base = this.buffer !== null ? this.buffer : this.state.applications;
        this.setState({
            applications: base.merge(Immutable.fromJS(map))
        });
        this.buffer = null;
    }

    /**
     * Puts a single application into the store.
     * @param  {object} app The app to add
     */
    receiveApplication(app) {
        this.setState({
            applications: this.state.applications.set(app.id, Immutable.fromJS(app))
        });
    }

    beginReceiveApplication(id) {
        this.setState({
            applications: this.state.applications.set(id, new Pending())
        });
    }

    failReceiveApplication(err) {
        this.setState({
            applications: this.state.applications.set(err.id, new Failed(err))
        });
    }
}