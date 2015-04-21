import BaseView from 'common/src/base-view';
import Template from './scope-detail.hbs';
import Flux from 'resource/src/flux';
import Markdown from 'common/src/markdown';
import 'common/asset/scss/resource/scope-detail.scss';

class ScopeDetail extends BaseView {
    constructor(props) {
        this.store = Flux.getStore('resource');
        this.actions = Flux.getActions('resource');
        this.className = 'scopeDetail';
        super(props);
    }

    update() {
        this.data = {
            resourceId: this.props.resourceId,
            scope: this.store.getScope(this.props.resourceId, this.props.scopeId)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.scope.description));
        return this;
    }
}

export default ScopeDetail;