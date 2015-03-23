import {Store} from 'flummox';
import Immutable from 'immutable';
import {Failed, Pending} from 'common/src/FetchResult';

export default class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const applicationActions = flux.getActions('applications');
        this.registerAsync(
            applicationActions.getApplication,
            this.beginReceiveApplication,
            this.receiveApplication,
            this.failReceiveApplication);

        this.register(applicationActions.getApplications, this.receiveApplications);
        this.state = {
            applications: Immutable.Map()
        };
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
                    {});
        this.setState({
            applications: this.state.applications.merge(Immutable.fromJS(map))
        });
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
}