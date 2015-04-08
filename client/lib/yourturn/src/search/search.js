import Flux from 'yourturn/src/flux';
import BaseView from 'common/src/base-view';
import Template from './search.hbs';
import 'common/asset/scss/yourturn/search.scss';

class SearchView extends BaseView {
    constructor() {
        this.store = Flux.getStore('search');
        this.state = {
            term: ''
        };
        this.className = 'searchView';
        this.events = {
            'click button': 'search',
            'keyup input': 'search'
        };
        super();
    }

    update() {
        this.state.results = this.store.getSearchResults( this.state.term );
        this.state.noResults = this.state.results.length === 0 && this.state.term.length > 0;
    }

    search(evt) {
        if (evt.type === 'keyup' && evt.keyCode !== 13) {
            // return if this is a keyup and another key
            // than enter was pressed
            return;
        }
        const ACTIONS = Flux.getActions('search');
        let searchTerm = this.$el.find('input').val();
        if (!searchTerm.length) {
            ACTIONS.clearSearchResults(searchTerm);
        } else {
            if (this.store.hasResults(searchTerm)) {
                ACTIONS.clearSearchResults(searchTerm);
            }
            ACTIONS.fetchSearchResults(searchTerm);
        }

        this.state.term = searchTerm;
    }

    render() {
        this.$el.html( Template( this.state ) );
        return this;
    }
}

export default SearchView;