import {Store} from 'flummox';
import Immutable from 'immutable';
import _ from 'lodash';

export default class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const applicationActions = flux.getActions('applications');
        this.register(applicationActions.getApplication, this.receiveApplication);
        this.register(applicationActions.getApplications, this.receiveApplications);
        this.state = {
            applications: Immutable.Map()
        };
    }

    receiveApplications(apps) {
        _.forEach(apps, app =>
            this.setState({
                applications: this.state.applications.set(app.id, Immutable.fromJS(app))
            })
        );
    }

    receiveApplication(app) {
        this.setState({
            applications: this.state.applications.set(app.id, Immutable.fromJS(app))
        });
    }
}