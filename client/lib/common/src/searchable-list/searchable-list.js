/* globals ENV_PRODUCTION */
import BaseView from 'common/src/base-view';
import Template from './searchable-list.hbs';
import _ from 'lodash';
import 'common/asset/scss/application/searchable-list.scss';

function filterItems(search) {
    return i => search
                .split(' ')
                .map(s => i.id.indexOf(s) >= 0 || i.resource_type_id.indexOf(s) >= 0)
                .some(id => id);
}

/**
 * A list control where you select items and can filter. It is
 * very tied to the notion of resource types and scopes currently,
 * but this is okay ^_^
 */
class SearchableList extends BaseView {
    constructor(props) {
        props.className = 'searchableList';
        props.events = {
            'keyup [data-action="filter"]': 'filter',
            'change input[type="checkbox"]': 'toggle'
        };
        super(props);
        this.state = {
            search: '',
            selected: props.selected || []
        };
    }

    /**
     * Toggles selection of an item.
     */
    toggle(e) {
        let id = this.$el.find(e.target).attr('id'),
            {selected} = this.state;
        if (selected.indexOf(id) >= 0) {
            selected.splice(selected.indexOf(id), 1);
        } else {
            selected.push(id);
        }
    }

    /**
     * Updates the search term and re-renders.
     */
    filter() {
        let term = this.$el.find('[data-action="filter"]').val();
        if (term !== this.state.search) {
            this.state.search = term || '';
            this.render();
        }
    }

    /**
     * Returns all selected items.
     */
    getSelection() {
        return _.intersection(this.props.items.map(i => `${i.resource_type_id}.${i.id}`), this.state.selected);
    }

    /**
     * Makes new data available to templates.
     */
    update() {
        this.data = {
            search: this.state.search,
            selected: this.state.selected,
            total_size: this.props.items.length,
            filtered: _.chain(this.props.items)
                        .filter(filterItems(this.state.search))
                        .groupBy('resource_type_id')
                        .forEach(i => {
                            Object
                                .keys(i)
                                .forEach(k => i[k].fullId = `${i[k].resource_type_id}.${i[k].id}`);
                        })
                        .value()
        };
        this.data.filtered_size = _.flatten(_.values(this.data.filtered)).length;
    }

    render() {
        this.update();
        this.$el.html(Template(this.data));
        this.$el.find('input[data-action="filter"]').focus();

        // .setSelectionRange is not worth the effort to mock it in node tests
        if (ENV_PRODUCTION) {
            this
            .$el
            .find('input[data-action="filter"]')[0]
            .setSelectionRange(this.state.search.length, this.state.search.length);
        }
        return this;
    }
}

export default SearchableList;
