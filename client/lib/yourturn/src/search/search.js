import BaseView from 'common/src/base-view';
import Template from './search.hbs';
import 'common/asset/scss/yourturn/search.scss';

class SearchView extends BaseView {
    constructor(props) {
        super({
            className: 'searchView',
            events: {
                'submit': 'search'
            },
            store: props.flux.getStore('search')
        });
        this.actions = props.flux.getActions('search');
        this.state = {
            term: ''
        };
    }

    update() {
        this.state.results = this.store.getSearchResults(this.state.term);
        this.state.noResults = this.state.results.length === 0 && this.state.term.length > 0;
    }

    search(evt) {
        evt.preventDefault();
        let searchTerm = this.$el.find('input').val();
        if (!searchTerm.length) {
            this.actions.clearSearchResults(searchTerm);
        } else {
            if (this.store.hasResults(searchTerm)) {
                this.actions.clearSearchResults(searchTerm);
            }
            this.actions.fetchSearchResults(searchTerm);
        }

        this.state.term = searchTerm;
    }

    render() {
        this.$el.html(Template(this.state));
        return this;
    }
}

export default SearchView;