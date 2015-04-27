import BaseView from 'common/src/base-view';
import Template from './version-list.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/scss/application/version-list.scss';

class AppVersion extends BaseView {
    constructor( props ) {
        props.className = 'versionList';
        props.stores = {
            application: Flux.getStore('application')
        };
        super(props);
    }

    update() {
        let {applicationId} = this.props,
            application = this.stores.application.getApplication(applicationId);
        this.data = {
            applicationId: applicationId,
            application: application instanceof FetchResult ? false : application,
            versions: this.stores.application.getApplicationVersions(applicationId)
        };
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }
}

export default AppVersion;
