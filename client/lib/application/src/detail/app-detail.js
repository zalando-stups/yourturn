import {View} from 'backbone';
import Template from './app-detail.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';

class AppDetail extends View {
    constructor( props ) {
        this._boundRender = this.render.bind( this );
        this.props = props;
        this.store = Flux.getStore('application');
        this.className = 'youturn-appDetail';
        this.bind();
        super();        
    }

    bind() {
        this.store.addListener( 'change', this._boundRender );
    }

    unbind() {
        this.store.removeListener( 'change', this._boundRender );
    }

    update() {
        this.data = {
            app: this.store.getApplication( this.props.applicationId )
        };
    }

    render() {
        this.update();
        let {data, $el} = this;

        if (data.app instanceof FetchResult) {
            $el.html(
                data.app.isPending() ?
                'Loading...' :
                ErrorTpl( data.app.getResult() )
            );
        } else {
            $el.html( Template( data ) );
        }
        return this;
    }

    remove() {
        this.unbind();
    }
}

export default AppDetail;