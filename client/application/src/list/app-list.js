import {View} from 'backbone';
import Template from './app-list.hbs';
import Flux from 'application/src/flux';

class AppDetail extends View {
    constructor() {
        this.store = Flux.getStore('application');
        this.data = {
            apps: this.store.getApplications()
        };
        
        this.template = Template;
        this.className = 'youturn-appList';
        super();        
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }

    remove() {
        console.log( 'remove was called' );
    }
}

export default AppDetail;