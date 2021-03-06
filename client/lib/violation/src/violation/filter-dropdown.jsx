import React from 'react';
import Icon from 'react-fa';
import listenToOutsideClick from 'react-onclickoutside/decorator';
import 'common/asset/less/violation/filter-dropdown.less';

const ListItem = (props) => {
    return (<li onClick={props.onChange} className={props.className + ' ' + (props.selected ? 'selected' : '')}>
            <label>
                <input
                    checked={props.selected}
                    type='checkbox' />
                {props.content}
            </label>
           </li>)
};

ListItem.displayName = 'ListItem';

ListItem.propTypes = {
    checked: React.PropTypes.string,
    className: React.PropTypes.string,
    content: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
};

class FilterDropdown extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false,
            filtered: false,
            filteredItems: [],
            selectedItems: props.selection ?
                            props.selection.reduce((m, i) => {m[i] = true; return m;}, {}) :
                            {}
        };
    }

    handleClickOutside() {
        this.filter('');
        this.setState({
            visible: false
        });
    }

    defaultComponentFn(item) {
        return <span>{item}</span>;
    }

    /*eslint-disable react/no-direct-mutation-state */
    // TODO fix
    componentWillReceiveProps(nextProps) {
        if (this.props.selection !== nextProps.selection) {
            if (nextProps.selection && nextProps.selection.length) {
                nextProps.selection.reduce((s, i) => {s[i] = true; return s;}, this.state.selectedItems);
            } else {
                this.state.selectedItems = {};
            }
        }
    }
    /*eslint-enable react/no-direct-mutation-state */

    onHeaderClick() {
        this.setState({visible: !this.state.visible});
    }

    filter(term) {
        let filter = term.toLowerCase(),
            lowerCaseItems = this.props.items.map(i => i.toLowerCase ? i.toLowerCase() : i);
        if (filter) {
            this.setState({
                filtered: true,
                filteredItems: this.props.items.filter((item, i) => lowerCaseItems[i].indexOf(filter) >= 0)
            })
        } else {
            this.setState({
                filtered: false
            });
        }
    }

    onItemFilter(evt) {
        this.filter(evt.target.value.toLowerCase());
    }

    publishSelectionUpdate(data) {
        if (this.props.onUpdate) {
            this.props.onUpdate(data);
        }
    }

    onSelectAll() {
        let selected = this.props.items.reduce((m, i) => {m[i] = true; return m; }, {});
        this.setState({
            selectedItems: selected
        });
        let selectedList = this.props.items.filter(i => !!selected[i]);
        this.publishSelectionUpdate(selectedList);
    }

    onSelectNone() {
        this.setState({
            selectedItems: {}
        });
        this.publishSelectionUpdate([]);
    }

    /*eslint-disable react/no-direct-mutation-state */
    // TODO fix
    onItemToggle(item) {
        if (this.state.selectedItems[item]) {
            delete this.state.selectedItems[item];
        } else {
            if (this.props.singleMode) {
                this.state.selectedItems = {};
            }
            this.state.selectedItems[item] = true;
        }
        let selected = this.props.items.filter(i => !!this.state.selectedItems[i]);
        this.publishSelectionUpdate(selected);
        this.setState(this.state);
    }
    /*eslint-enable react/no-direct-mutation-state */

    render() {
        const items = this.props.items.sort(),
              selected = items.filter(i => !!this.state.selectedItems[i]),
              unselected = items.filter(i => !this.state.selectedItems[i]),
              componentFn = this.props.customComponentFn || this.defaultComponentFn;
        return <div ref='dropdown' className='filter-dropdown'>
                <header
                    ref='header'
                    onClick={this.onHeaderClick.bind(this)}>
                    <Icon name='filter' fixedWidth />
                    <span>{this.props.title}</span>
                    <Icon name='caret-down' fixedWidth />
                </header>
                {this.state.visible ?
                    <div className='filterDropdown-dropdown'>
                        {!this.props.singleMode ?
                            <div className='filterDropdown-special-button'>
                                <span onClick={this.onSelectAll.bind(this)}>All</span>
                                <span onClick={this.onSelectNone.bind(this)}>None</span>
                            </div>
                            :
                            null}
                        {this.props.disableSearch ?
                            null
                            :
                            <div>
                                <input
                                    onChange={this.onItemFilter.bind(this)}
                                    placeholder='Search'
                                    type='search' />
                            </div>
                        }
                        <div className='filterDropdown-list-container'>
                            <ul>
                            {(this.state.filtered ?
                                [] :
                                selected).map(i => <ListItem
                                                            className='filterButton-list-item'
                                                            key={i}
                                                            selected={this.state.selectedItems[i]}
                                                            onChange={this.onItemToggle.bind(this, i)}
                                                            content={componentFn(i)} />)}
                            {(this.state.filtered ?
                                this.state.filteredItems :
                                unselected).map(i => <ListItem
                                                            className='filterButton-list-item'
                                                            key={i}
                                                            selected={this.state.selectedItems[i]}
                                                            onChange={this.onItemToggle.bind(this, i)}
                                                            content={componentFn(i)} />)}
                            </ul>
                        </div>
                    </div> :
                    null}
                </div>;
    }
}

FilterDropdown.displayName = 'FilterDropdown';

FilterDropdown.propTypes = {
    customComponentFn: React.PropTypes.func,
    disableSearch: React.PropTypes.bool,
    items: React.PropTypes.array.isRequired,
    onUpdate: React.PropTypes.func,
    selection: React.PropTypes.array,
    singleMode: React.PropTypes.bool,
    title: React.PropTypes.string
};

export default listenToOutsideClick(FilterDropdown);
