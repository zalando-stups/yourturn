import BaseView from 'common/src/base-view';
import Template from './resource-detail.hbs';
import Flux from 'resource/src/flux';
import Markdown from 'common/src/markdown';
import 'common/asset/scss/resource/resource-detail.scss';

class ResourceDetail extends BaseView {
    constructor(props) {
        this.store = Flux.getStore('resource');
        this.className = 'resourceDetail';
        super(props);
    }

    update() {
        this.data = {
            resource: this.store.getResource(this.props.resourceId),
            scopes: this.store.getScopes(this.props.resourceId)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.resource.description));
        return this;
    }
}

export default ResourceDetail;