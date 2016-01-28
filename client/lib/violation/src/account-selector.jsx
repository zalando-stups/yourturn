import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import {Typeahead} from 'react-typeahead';
import fuzzysearch from 'fuzzysearch';
import Collapsible from 'common/src/collapsible.jsx';
import 'common/asset/less/common/account-selector.less';
import 'common/asset/less/common/typeahead.less';

function filterOptionFn(input, option) {
    return input
            .trim()
            .split(' ')
            .some(term => fuzzysearch(term, option.name + option.id));
}

function getDisplayedAccounts(selected, filter) {
    return filter ?
            selected.filter(a => fuzzysearch(filter, a.name)) :
            selected;
}

class AccountSelector extends React.Component {
    constructor(props) {
        super();
        this.state = {
            allSelected: props.selectedAccounts ? props.selectedAccounts.length === props.selectableAccounts.length : false,
            filter: '',
            selectedAccounts: props.selectedAccounts || []
        };
    }

    _selectAll() {
        this.props.onToggleAccount(this.props.selectableAccounts.map(a => a.id));

        this.setState({
            allSelected: true,
            selectedAccounts: _.sortBy(this.props.selectableAccounts, 'name')
        });
    }

    _selectAccount(account) {
        let {id} = account;
        if (this.state.selectedAccounts.map(a => a.id).indexOf(id) >= 0) {
            return;
        }
        this.state.selectedAccounts.push(account);
        this.setState({
            selectedAccounts: _.sortBy(this.state.selectedAccounts, 'name')
        });
        let {activeAccountIds} = this.props;
        if (activeAccountIds.indexOf(account.id) < 0) {
            this.props.onToggleAccount(activeAccountIds.concat([account.id]));
        }
    }

    _toggleAccount(accountId) {
        let {activeAccountIds} = this.props,
            index = activeAccountIds.indexOf(accountId);
        if (index >= 0) {
            // drop
            activeAccountIds.splice(index, 1);
        } else {
            activeAccountIds.push(accountId);
        }
        if (typeof this.props.onToggleAccount === 'function') {
            this.props.onToggleAccount(activeAccountIds);
        }
    }

    _toggleAll() {
        let displayedIds = getDisplayedAccounts(this.state.selectedAccounts, this.state.filter).map(a => a.id),
            activeIds = this.props.activeAccountIds.concat(displayedIds);
        // dedup
        activeIds = activeIds.filter((el, idx, all) => all.lastIndexOf(el) === idx);
        this.props.onToggleAccount(activeIds);
    }

    _untoggleAll() {
        let displayedIds = getDisplayedAccounts(this.state.selectedAccounts, this.state.filter).map(a => a.id),
            activeIds = this.props.activeAccountIds.filter(a => displayedIds.indexOf(a) < 0);
        this.props.onToggleAccount(activeIds);
    }

    _filter(evt) {
        this.setState({
            filter: evt.target.value
        });
    }

    render() {
        let {selectableAccounts, activeAccountIds} = this.props,
            {selectedAccounts} = this.state,
            displayedAccounts = getDisplayedAccounts(selectedAccounts, this.state.filter),
            partitionedAccounts = _.partition(displayedAccounts, a => activeAccountIds.indexOf(a.id) >= 0),
            activeAccounts = partitionedAccounts[0],
            inactiveAccounts = partitionedAccounts[1];
        return <div className='account-selector'>
                    {!this.state.allSelected ?
                        <div>
                            <div>
                                <small>You can search by name or account number or <span
                                    onClick={this._selectAll.bind(this)}
                                    className='btn btn-default btn-small'>
                                    <Icon name='plus' /> Select all accounts
                                </span>
                            </small>
                            </div>
                            <div className='input-group'>
                                <Icon name='search' />
                                <Typeahead
                                    placeholder='stups-test 123456'
                                    options={selectableAccounts}
                                    displayOption={option => `${option.name} (${option.id})`}
                                    filterOption={filterOptionFn}
                                    onOptionSelected={this._selectAccount.bind(this)}
                                    maxVisible={10} />
                            </div>
                        </div>
                        :
                        <div className='input-group'>
                            <Icon name='search' />
                            <input
                                onChange={this._filter.bind(this)}
                                placeholder='Search in selected accounts'
                                type='text'/>
                        </div>}
                    <div className='account-selector-toggle-buttons btn-group'>
                        <div onClick={this._toggleAll.bind(this)} className='btn btn-default'>
                            <Icon name='check-square-o'/> Toggle all
                        </div>
                        <div onClick={this._untoggleAll.bind(this)} className='btn btn-default'>
                            <Icon name='square-o' /> Untoggle all
                        </div>
                    </div>
                    <div className='account-selector-list'>
                    { displayedAccounts.length === 0 ?
                        <span>Please add some accounts.</span> :
                        null
                    }
                    {_.sortBy(activeAccounts, 'name')
                        .map(a =>
                        <label
                            key={a.id}
                            className={activeAccountIds.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                            <input
                                type='checkbox'
                                value={a.id}
                                onChange={this._toggleAccount.bind(this, a.id)}
                                defaultChecked={activeAccountIds.indexOf(a.id) >= 0}/> {a.name} <small>({a.id})</small>
                        </label>)}
                    {inactiveAccounts.length ?
                        <Collapsible
                            header='Untoggled accounts'>
                        {_.sortBy(inactiveAccounts, 'name')
                            .map(a =>
                            <label
                                key={a.id}
                                className={activeAccountIds.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                                <input
                                    type='checkbox'
                                    value={a.id}
                                    onChange={this._toggleAccount.bind(this, a.id)}
                                    defaultChecked={activeAccountIds.indexOf(a.id) >= 0}/> {a.name} <small>({a.id})</small>
                            </label>)}
                        </Collapsible>
                        :
                        null
                    }
                    </div>
                </div>;
    }
}
AccountSelector.displayName = 'AccountSelector';
AccountSelector.propTypes = {
    selectableAccounts: React.PropTypes.array.isRequired,
    activeAccountIds: React.PropTypes.array.isRequired,
    selectedAccounts: React.PropTypes.array,
    onToggleAccount: React.PropTypes.func.isRequired
};

export default AccountSelector;