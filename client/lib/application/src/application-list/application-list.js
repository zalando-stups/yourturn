import BaseView from 'common/src/base-view';
import Template from './application-list.hbs';
import 'common/asset/scss/application/application-list.scss';

class AppDetail extends BaseView {
    constructor(props) {
        super({
            className: 'applicationList',
            store: props.flux.getStore('application'),
            events: {
                'submit': 'filter'
            }
        });
        this.state = {
            filterTerm: ''
        };

    }

    update() {
        this.data = {
            apps: this.store.getApplications(this.state.filterTerm),
            filterTerm: this.state.filterTerm
        };
    }

    filter(evt) {
        evt.preventDefault();
        this.state.filterTerm = this.$el.find('input').val();
        this.update();
        this.render();
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default AppDetail;
