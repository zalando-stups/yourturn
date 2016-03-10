import React from 'react';
import Icon from 'react-fa';
import listenToOutsideClick from 'react-onclickoutside/decorator';
import 'common/asset/less/violation/filter-dropdown.less';

class ListItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <li onClick={this.props.onChange} className={this.props.className + ' ' + (this.props.selected ? 'selected' : '')}>
                <label>
                    <input
                        checked={this.props.selected}
                        type="checkbox" />
                    {this.props.content}
                </label>
               </li>
    }
}

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
        this.setState({
            visible: false
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selection !== nextProps.selection) {
            if (nextProps.selection && nextProps.selection.length) {
                nextProps.selection.reduce((s, i) => {s[i] = true; return s;}, this.state.selectedItems);
            } else {
                this.state.selectedItems = {};
            }
        }
    }

    onHeaderClick() {
        this.state.visible = !this.state.visible;
        this.setState(this.state);
    }

    onItemFilter(evt) {
        let filter = evt.target.value.toLowerCase(),
            lowerCaseItems = this.props.items.map(i => i.toLowerCase());
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

    render() {
        var items = this.props.items.sort(),
            selected = items.filter(i => !!this.state.selectedItems[i]),
            unselected = items.filter(i => !this.state.selectedItems[i]);
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
                        <div>
                            <input
                                onChange={this.onItemFilter.bind(this)}
                                placeholder="Search"
                                type="search" />
                        </div>
                        <div className='filterDropdown-list-container'>
                            <ul>
                            {(this.state.filtered ?
                                [] :
                                selected).map(i => <ListItem
                                                            className='filterButton-list-item'
                                                            key={i}
                                                            selected={this.state.selectedItems[i]}
                                                            onChange={this.onItemToggle.bind(this, i)}
                                                            content={i} />)}
                            {(this.state.filtered ?
                                this.state.filteredItems :
                                unselected).map(i => <ListItem
                                                            className='filterButton-list-item'
                                                            key={i}
                                                            selected={this.state.selectedItems[i]}
                                                            onChange={this.onItemToggle.bind(this, i)}
                                                            content={i} />)}
                            </ul>
                        </div>
                    </div> :
                    null}
                </div>;
    }
}
FilterDropdown.displayName = 'FilterDropdown';

export default listenToOutsideClick(FilterDropdown);
