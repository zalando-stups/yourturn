import BaseView from 'common/src/base-view';
import Template from './application-detail.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/application-detail.scss';

class AppDetail extends BaseView {
    constructor( props ) {
        this.stores = {
            application: Flux.getStore('application'),
            api: Flux.getStore('api')
        };
        this.className = 'applicationDetail';
        super(props);
    }

    update() {
        let {applicationId} = this.props;
        this.data = {
            app: this.stores.application.getApplication( applicationId ),
            api: this.stores.api.getApi( applicationId )
        };
        this.data.hasApi = this.data.api && this.data.api.status === 'SUCCESS';
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
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.app.description));
        }
        return this;
    }
}

export default AppDetail;
