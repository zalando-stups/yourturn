import React from 'react';
import Icon from 'react-fa';
import 'common/asset/less/application/editable-list.less';

class EditableList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            items: props.items || [],
            limbo: [],
            input: ''
        };
    }

    updateInput(evt) {
        this.setState({
            input: evt.target.value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items.length !== this.props.items.length) {
            this.setState({
                items: nextProps.items
            });
        }
    }

    /*eslint-disable react/no-direct-mutation-state */
    // TODO rewrite state handling here
    addItem(evt) {
        evt.preventDefault();
        let regex = new RegExp(this.props.pattern);

        // check validity, would be automatic if it weren't for nested forms
        if (this.state.input.length >= this.props.minlength &&
            this.state.input.length <= this.props.maxlength &&
            this.state.input.match(regex)) {

            this.state.items.push(this.state.input);
            // dedup
            this.state.items = this.state.items.filter((i, idx, items) => items.lastIndexOf(i) === idx);
            this.setState({
                input: '',
                items: this.state.items
            });
            this.props.onChange(this.state.items);
        }
    }

    undoDeleteItem(item) {
        let idx = this.state.limbo.indexOf(item);
        if (idx >= 0) {
            this.state.limbo.splice(idx, 1);
            this.state.items.push(item);
            this.setState({
                items: this.state.items,
                limbo: this.state.limbo
            });
            this.props.onChange(this.state.items);
        }
    }

    deleteItem(item) {
        let idx = this.state.items.indexOf(item);
        if (idx >= 0) {
            this.state.limbo.push(item);
            this.state.items.splice(idx, 1);
            this.setState({
                items: this.state.items,
                limbo: this.state.limbo
            });
            this.props.onChange(this.state.items);
        }
    }
    /*eslint-enable react/no-direct-mutation-state */

    render() {
        let {items, input, limbo} = this.state;
        return <div className='editableList'>
                    <div className='input-group'>
                        <input
                            onChange={this.updateInput.bind(this)}
                            pattern={this.props.pattern || null}
                            placeholder={this.props.placeholder}
                            maxLength={this.props.maxlength || null}
                            value={input}
                            type='text' />
                        <button
                            type='submit'
                            onClick={this.addItem.bind(this)}
                            className='btn btn-default'>
                                <Icon name='plus' /> Add {this.props.itemName || 'item'}
                        </button>
                    </div>
                    {items
                        .concat(limbo)
                        .sort()
                        .map(
                            item =>
                                items.indexOf(item) >= 0 ?
                                    <div
                                        key={item}
                                        className='list-item'>
                                        <span
                                            data-is-marked={this.props.markedItems.indexOf(item) >= 0}
                                            data-block='editable-list-item'>{item}</span>
                                        <div
                                            onClick={this.deleteItem.bind(this, item)}
                                            className='btn btn-danger'>
                                            <Icon name='close' /> Remove
                                        </div>
                                    </div> :
                                    <div
                                        key={item}
                                        className='list-item'>
                                        <span data-is-in-limbo='true'>{item}</span>
                                        <div
                                            onClick={this.undoDeleteItem.bind(this, item)}
                                            className='btn btn-default'>
                                            <Icon name='undo' /> Undo
                                        </div>
                                    </div>)}
                </div>;
    }
}

EditableList.displayName = 'EditableList';

EditableList.propTypes = {
    itemName: React.PropTypes.string,
    items: React.PropTypes.array,
    markedItems: React.PropTypes.array,
    maxlength: React.PropTypes.number.isRequired,
    minlength: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    pattern: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
};

export default EditableList;