import {View} from 'backbone';
import Template from './app-detail.hbs';
import Flux from 'application/src/flux';

class AppDetail extends View {
    constructor( applicationId ) {
        this.store = Flux.getStore('application');
        this.data = {
            app: this.store.getApplication( applicationId )
        };
        this.template = Template;
        this.className = 'youturn-appDetail';
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