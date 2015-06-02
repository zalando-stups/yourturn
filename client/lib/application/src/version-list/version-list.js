/* globals ENV_TEST */
import _ from 'lodash';
import BaseView from 'common/src/base-view';
import Template from './version-list.hbs';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/less/application/version-list.less';

class AppVersion extends BaseView {
    constructor(props) {
        props.className = 'versionList';
        props.stores = {
            kio: props.flux.getStore('kio')
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
            application = this.stores.kio.getApplication(applicationId),
            versions = _.take(this.stores.kio.getApplicationVersions(applicationId, this.state.term), 20);
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
