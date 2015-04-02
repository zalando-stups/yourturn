import BaseView from 'common/src/base-view';
import Template from './app-detail.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';

import 'common/asset/scss/application/application.scss';

class AppDetail extends BaseView {
    constructor( props ) {
        this.store = Flux.getStore('application');
        this.className = 'applicationDetail';
        super(props);
    }

    update() {
        this.data = {
            app: this.store.getApplication( this.props.applicationId )
        };
    }

    render() {
        let {data, $el} = this;

        if (data.app instanceof FetchResult) {
            $el.html(
                data.app.isPending() ?
                Placeholder() :
                ErrorTpl( data.app.getResult() )
            );
        } else {
            $el.html( Template( data ) );
        }
        return this;
    }
}

export default AppDetail;