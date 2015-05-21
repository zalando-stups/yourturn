/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';
import 'common/asset/scss/resource/resource-list.scss';

class ResourceList extends BaseView {
    constructor(props) {
        super({
            className: 'resourceList',
            store: props.flux.getStore('resource'),
            events: {
                'keyup input': 'search',
                'submit': 'search'
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

    search(evt) {
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
            .setSelectionRange(this.state.term.length, this.state.term.length);
        }
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ResourceList;
