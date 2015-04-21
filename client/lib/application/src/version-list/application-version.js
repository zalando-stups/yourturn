import BaseView from 'common/src/base-view';
import Template from './application-version.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from '../detail/placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/application.scss';

class AppVersion extends BaseView {
    constructor( props ) {
        this.stores = {
            application: Flux.getStore('application'),
        };
        this.className = 'applicationVersion';
        super(props);
    }

    update() {
        let {applicationId} = this.props;
        this.data = {
            versions: this.stores.application.getApplicationVersions( applicationId ),
        };
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }
}

export default AppVersion;
