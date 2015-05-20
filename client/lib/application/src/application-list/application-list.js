/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './application-list.hbs';
import 'common/asset/scss/application/application-list.scss';

class AppList extends BaseView {
    constructor(props) {
        props.className = 'applicationList',
        props.stores = {
            application: props.flux.getStore('application'),
            user: props.globalFlux.getStore('user')
        };
        props.events = {
           'keyup': 'filter',
           'submit': 'filter'
        };
        super(props);
        this.state = {
            term: ''
        };
    }

    update() {
        let userTeamIds = _.pluck(this.stores.user.getUserTeams(), 'id');
        this.data = {
            teamApps: this.stores.application.getTeamApplications(this.state.term, userTeamIds),
            otherApps: this.stores.application.getOtherApplications(this.state.term, userTeamIds),
            term: this.state.term
        };
    }

    filter(evt) {
        evt.preventDefault();
        this.state.term = this.$el.find('input').val();
        this.update();
        this.render();
        this.$el.find('input[data-action="search"]').focus();

        // .setSelectionRange is not worth the effort to mock it in node tests
        if (!ENV_TEST) {
            this
            .$el
            .find('input[data-action="search"]')[0]
            .setSelectionRange(this.state.term.length, this.state.term.length);
        }
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default AppList;
