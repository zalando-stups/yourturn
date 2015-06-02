import _ from 'lodash';
import BaseView from 'common/src/base-view';
import Template from './application-detail.hbs';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/application-detail.scss';

class AppDetail extends BaseView {
    constructor(props) {
        props.className = 'applicationDetail';
        props.stores = {
            user: props.globalFlux.getStore('user'),
            kio: props.flux.getStore('kio'),
            twintip: props.flux.getStore('twintip')
        };
        super(props);
    }

    update() {
        let {applicationId} = this.props,
            application = this.stores.kio.getApplication(applicationId);
        this.data = {
            applicationId: applicationId,
            app: application,
            isOwnApplication: this.stores.user
                                .getUserTeams()
                                .map(team => team.id)
                                .some(id => id === application.team_id),
            api: this.stores.twintip.getApi(applicationId),
            versions: _.take(this.stores.kio.getApplicationVersions(applicationId), 3)
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
