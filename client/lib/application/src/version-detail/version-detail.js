import BaseView from 'common/src/base-view';
import Template from './version-detail.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/application-detail.scss';

class VersionDetail extends BaseView {
    constructor( props ) {
        this.stores = {
            application: Flux.getStore('application'),
        };
        this.className = 'applicationDetail';
        super(props);
    }

    update() {
        let {applicationId} = this.props,
            {versionId} = this.props;
        this.data = {
            ver: this.stores.application.getApplicationVersion( applicationId, versionId )
        };
        console.log('ver', this.data.ver);
    }

    render() {
        let {data, $el} = this;

        if (data.ver instanceof FetchResult) {
            $el.html(
                data.ver.isPending() ?
                Placeholder() :
                ErrorTpl( data.ver.getResult() )
            );
        } else {
            $el.html( Template( data ) );
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.ver.notes));
        }
        return this;
    }
}

export default VersionDetail;
