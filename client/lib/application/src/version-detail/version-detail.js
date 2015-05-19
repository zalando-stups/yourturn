import BaseView from 'common/src/base-view';
import Template from './version-detail.hbs';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/version-detail.scss';

class VersionDetail extends BaseView {
    constructor(props) {
        props.className = 'versionDetail';
        props.stores = {
            application: props.flux.getStore('application')
        };
        super(props);
    }

    update() {
        let {applicationId, versionId} = this.props,
            application = this.stores.application.getApplication(applicationId),
            version = this.stores.application.getApplicationVersion(applicationId, versionId);
        this.data = {
            applicationId: applicationId,
            versionId: versionId,
            version: version,
            approvalCount: this.stores.application.getApprovals(applicationId, versionId).length,
            application: application instanceof FetchResult ? false : application
        };
    }

    render() {
        let {data, $el} = this;

        if (data.version instanceof FetchResult) {
            $el.html(
                data.version.isPending() ?
                Placeholder(data) :
                ErrorTpl(data.version.getResult())
            );
        } else {
            $el.html(Template(data));
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.version.notes));
        }
        return this;
    }
}

export default VersionDetail;
