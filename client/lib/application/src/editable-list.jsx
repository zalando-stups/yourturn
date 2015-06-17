import React from 'react';
import Icon from 'react-fa';
import 'common/asset/less/application/editable-list.less';

class EditableList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            items: props.items || [],
            input: ''
        };
    }

    updateInput(evt) {
        this.setState({
            input: evt.target.value
        });
    }

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

    deleteItem(item) {
        let idx = this.state.items.indexOf(item);
        if (idx >= 0) {
            this.state.items.splice(idx, 1);
            this.setState({
                items: this.state.items
            });
            this.props.onChange(this.state.items);
        }
    }

    render() {
        let {items, input} = this.state;
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
                            className='btn btn-default'><Icon name='plus' /> Add {this.props.itemName || 'item'}
                        </button>
                    </div>
                    {items
                        .sort()
                        .map(
                            item =>
                                <div
                                    key={item}
                                    className='list-item'>
                                    <span data-block='editable-list-item'>{item}</span>
                                    <div
                                        onClick={this.deleteItem.bind(this, item)}
                                        className='btn btn-danger'>
                                        <Icon name='close' /> Remove
                                    </div>
                                </div>)}
                </div>;
    }
}
EditableList.displayName = 'EditableList';
EditableList.propTypes = {
    pattern: React.PropTypes.string.isRequired,
    minlength: React.PropTypes.number.isRequired,
    maxlength: React.PropTypes.number.isRequired,
    placeholder: React.PropTypes.string,
    itemName: React.PropTypes.string,
    items: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
};

export default EditableList;