import {View} from 'backbone';
import Template from './app-list.hbs';
import Flux from 'application/src/flux';

class AppDetail extends View {
    constructor() {
        this._boundRender = this.render.bind( this );
        this.store = Flux.getStore('application');
        this.data = {
            apps: this.store.getApplications()
        };
        
        this.template = Template;
        this.className = 'youturn-appList';
        this.bind(),
        super();
    }

    bind() {
        this.store.addListener( 'change', this._boundRender );
    }

    unbind() {
        this.store.removeListener( 'change', this._boundRender );
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }

    remove() {
        this.unbind();
    }
}

export default AppDetail;