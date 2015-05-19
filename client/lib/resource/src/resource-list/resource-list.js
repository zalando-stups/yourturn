import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';

class ResourceList extends BaseView {
    constructor(props) {
        super({
            className: 'resourceList',
            store: props.flux.getStore('resource'),
            events: {
                'submit': 'filter'
            }
        });
        this.state = {
            term: ''
        };
    }

    update() {
        this.data = {
            resources: this.store.getResources(this.state.term),
            term: this.state.term
        };
    }

    filter(evt) {
        evt.preventDefault();
        this.state.term = this.$el.find('input').val();
        this.update();
        this.render();
        this.$el.find('input[data-action="search"]').focus();

        // .setSelectionRange is not worth the effort to mock it in node tests
        if (!ENV_TEST) {
            this
            .$el
            .find('input[data-action="search"]')[0]
            .setSelectionRange(this.state.search.length, this.state.search.length);
        }
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ResourceList;
