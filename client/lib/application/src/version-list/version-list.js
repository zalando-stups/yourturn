/* globals ENV_TEST */
import _ from 'lodash';
import BaseView from 'common/src/base-view';
import Template from './version-list.hbs';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/scss/application/version-list.scss';

class AppVersion extends BaseView {
    constructor(props) {
        props.className = 'versionList';
        props.stores = {
            application: props.flux.getStore('application')
        };
        props.events = {
            'submit': 'search',
            'keyup [data-action="search"]': 'search'
        };
        super(props);
        this.state = {
            term: ''
        };
    }

    search(evt) {
        evt.preventDefault();
        this.state.term = this.$el.find('[data-action="search"]').val();
        this.update();
        this.render();
    }

    update() {
        let {applicationId} = this.props,
            application = this.stores.application.getApplication(applicationId),
            versions = _.take(this.stores.application.getApplicationVersions(applicationId, this.state.term), 20);
        this.data = {
            applicationId: applicationId,
            application: application instanceof FetchResult ? false : application,
            versions: versions,
            term: this.state.term
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el.find('[data-action="search"]').focus();
        if (!ENV_TEST) {
            this
            .$el
            .find('input[data-action="search"]')[0]
            .setSelectionRange(this.state.term.length, this.state.term.length);
        }
        return this;
    }
}

export default AppVersion;
