import BaseView from 'common/src/base-view';
import Template from './editable-list.hbs';
import _ from 'lodash';
import 'common/asset/scss/application/editable-list.scss';


/**
 * A list control where you can add and remove items.
 */
class EditableList extends BaseView {
    constructor(props) {
        props.className = 'editableList';
        props.events = {
            'click [data-action="add-item"]': 'addItem',
            'click [data-action="delete-item"]': 'deleteItem',
            'change input': 'updateInputState'
        };
        super(props);
        this.state = {
            input: '',
            items: props.items || []
        };
    }

    /**
     * Keeps track of the current input to not lose it on re-render.
     */
    updateInputState(e) {
        let $input = this.$el.find('input').first(),
            input = $input.val();
        this.state.input = input;
    }

    /**
     * Removes an item from the list.
     */
    deleteItem(evt) {
        evt.preventDefault();
        let tgt = this.$el.find(evt.target),
            idx = parseInt(tgt.attr('data-id'), 10);
        this.state.items.splice(idx, 1);
        this.render();
    }

    /**
     * Returns the items.
     */
    getSelection() {
        return this.state.items;
    }

    /**
     * Adds an item into the list if it is valid.
     */
    addItem(evt) {
        evt.preventDefault();
        let {$el} = this,
            $input = $el.find('input').first(),
            item = $input.val();
        if (item.length === 0 || !$input[0].checkValidity()) {
            return;
        }
        // reset inputs
        $input.val('');
        this.state.input = '';
        // add
        this.state.items.push(item);
        // remove duplicates
        this.state.items = this.state.items.filter((i, idx, items) => items.lastIndexOf(i) === idx);
        this.render();
    }
    
    /**
     * Transfer data from state to views.
     */
    update() {
        this.data = {
            itemName: this.props.itemName || '',
            input: this.state.input,
            items: this.state.items.sort()
        };
    }

    render() {
        this.update();
        this.$el.html(Template(this.data));
        this.$el.find('input').focus();
        
        return this;
    }
}

export default EditableList;
