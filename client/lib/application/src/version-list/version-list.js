import BaseView from 'common/src/base-view';
import Template from './version-list.hbs';
import Flux from 'application/src/flux';

class AppVersion extends BaseView {
    constructor( props ) {
        this.stores = {
            application: Flux.getStore('application')
        };
        this.className = 'applicationVersion';
        super(props);
    }

    update() {
        let {applicationId} = this.props;
        this.data = {
            app: applicationId,
            versions: this.stores.application.getApplicationVersions( applicationId )
        };
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }
}

export default AppVersion;
