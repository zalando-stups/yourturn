import _ from 'lodash';
import BaseView from 'common/src/base-view';
import Template from './application-detail.hbs';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/application-detail.scss';

class AppDetail extends BaseView {
    constructor( props ) {
        props.className = 'applicationDetail';
        props.stores = {
            application: props.flux.getStore('application'),
            api: props.flux.getStore('api')
        };
        super(props);
    }

    update() {
        let {applicationId} = this.props;
        this.data = {
            applicationId: applicationId,
            app: this.stores.application.getApplication( applicationId ),
            api: this.stores.api.getApi( applicationId ),
            versions: _.take(this.stores.application.getApplicationVersions(applicationId), 3)
        };
        this.data.hasApi = this.data.api && this.data.api.status === 'SUCCESS';
    }

    render() {
        let {data, $el} = this;

        if (data.app instanceof FetchResult) {
            $el.html(
                data.app.isPending() ?
                Placeholder(data) :
                ErrorTpl(data.app.getResult())
            );
        } else {
            $el.html(Template(data));
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.app.description));
        }
        return this;
    }
}

export default AppDetail;
