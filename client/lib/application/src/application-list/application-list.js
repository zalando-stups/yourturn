import BaseView from 'common/src/base-view';
import Template from './application-list.hbs';
import 'common/asset/scss/application/application-list.scss';

class AppDetail extends BaseView {
    constructor(props) {
        super({
            className: 'applicationList',
            store: props.flux.getStore('application'),
            events: {
                'keyup': 'filter',
                'submit': 'filter'
            }
        });
        this.state = {
            term: ''
        };

    }

    update() {
        this.data = {
            apps: this.store.getApplications(this.state.term),
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
            .setSelectionRange(this.state.search.length, this.state.search.length);
        }
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default AppDetail;
