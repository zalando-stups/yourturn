import BaseView from 'common/src/base-view';
import Template from './searchable-list.hbs';
import _ from 'lodash';
import 'common/asset/scss/application/searchable-list.scss';

function filterItems(search) {
    return i => search
                .split(' ')
                .map(s => i.id.indexOf(s) >= 0 || i.resourceId.indexOf(s) >= 0)
                .some(id => id);
}

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

    toggle(e) {
        let id = this.$el.find(e.target).attr('id'),
            {selected} = this.state;
        if (selected.indexOf(id) >= 0) {
            selected.splice(selected.indexOf(id), 1);
        } else {
            selected.push(id);
        }
    }

    filter() {
        let term = this.$el.find('[data-action="filter"]').val();
        if (term !== this.state.search) {
            this.state.search = term || '';
            this.render();
        }
    }

    getSelection() {
        return this.state.selected;
    }

    update() {
        this.data = {
            search: this.state.search,
            selected: this.state.selected,
            total_size: this.props.items.length,
            filtered: _.chain(this.props.items)
                        .filter(filterItems(this.state.search))
                        .groupBy('resourceId')
                        .forEach(i => {
                            Object
                                .keys(i)
                                .forEach(k => i[k].fullId = `${i[k].resourceId}.${i[k].id}`);
                        })
                        .value()
        };
        this.data.filtered_size = _.flatten(_.values(this.data.filtered)).length;
    }

    render() {
        this.update();
        this.$el.html(Template(this.data));
        this.$el.find('input[data-action="filter"]').focus();
        this.$el.find('input[data-action="filter"]')[0].setSelectionRange(this.state.search.length, this.state.search.length);
        return this;
    }
}

export default SearchableList;
