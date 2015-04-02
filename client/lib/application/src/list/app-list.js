import BaseView from 'common/src/base-view';
import Template from './app-list.hbs';
import Flux from 'application/src/flux';

class AppDetail extends BaseView {
    constructor() {
        this.store = Flux.getStore('application');
        this.className = 'youturn-appList';
        super();
    }

    update() {
        this.data = {
            apps: this.store.getApplications()
        };
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }
}

export default AppDetail;