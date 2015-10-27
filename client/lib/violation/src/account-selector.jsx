import React from 'react';
import Icon from 'react-fa';
import {Typeahead} from 'react-typeahead';
import 'common/asset/less/common/account-selector.less';

function filterOptionFn(input, option) {
    return input
            .trim()
            .split(' ')
            .some(term => (option.name + option.id).indexOf(term) >= 0);
}

class AccountSelector extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selectedAccounts: props.selectedAccounts || []
        };
    }

    _selectAccount(account) {
        let {id} = account;
        if (this.state.selectedAccounts.map(a => a.id).indexOf(id) >= 0) {
            return;
        }
        this.state.selectedAccounts.push(account);
        this.state.selectedAccounts
            .sort((a, b) => {
                    let aName = a.name.toLowerCase(),
                        bName = b.name.toLowerCase();
                    return aName < bName ?
                            -1 :
                            bName < aName ?
                                1 : 0;
                 });
        this.setState({
            selectedAccounts: this.state.selectedAccounts
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

    render() {
        let {selectableAccounts, activeAccountIds} = this.props,
            {selectedAccounts} = this.state;
        return <div className='account-selector'>
                    <div>Show violations in accounts:</div>
                    <small>You can search by name or account number.</small>
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
                    {selectedAccounts.map(a =>
                        <label
                            key={a.id}
                            className={activeAccountIds.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                            <input
                                type='checkbox'
                                value={a.id}
                                onChange={this._toggleAccount.bind(this, a.id)}
                                defaultChecked={activeAccountIds.indexOf(a.id) >= 0}/> {a.name} <small>({a.id})</small>
                        </label>)}
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