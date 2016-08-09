import React from 'react';
import Icon from 'react-fa';
import 'common/asset/less/application/account-list.less';

export default class AccountList extends React.Component {
    constructor() {
        super();
        this.state = {
            filter: ''
        }
    }

    filter(evt) {
        this.setState({
            filter: evt.target.value ? evt.target.value.toLowerCase() : ''
        })
    }

    toggle(account) {
        let updated;
        if (this.props.selected.indexOf(account) !== -1) {
            // already selected, unselect now
            updated = this.props.selected.filter(a => a !== account);
        } else {
            // add
            updated = this.props.selected.concat([account]).sort();
        }
        if (this.props.onChange) {
            this.props.onChange(updated);
        }
    }

    render() {
        const selection = this.props.selected.reduce((m, s) => { m[s] = true; return m; }, {}),
              {filter} = this.state;
        return <div className='accountList'>
                    <div className='form'>
                        <div className='input-group'>
                            <div
                                className='input-addon'>
                                <Icon name='search' />
                            </div>
                            <input
                                name='yourturn_account_search'
                                value={filter}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your term'
                                placeholder='stups' />
                        </div>
                    </div>
                <ul>
                    {this.props.accounts
                        .filter(a => !!filter ? a.indexOf(filter) >= 0 : true)
                        .map(a =>
                        <li key={a} data-block='accountList-item'>
                            <label className={!!selection[a] ? 'selected' : ''}>
                                <input
                                    data-block='accountList-item-input'
                                    onChange={this.toggle.bind(this, a)}
                                    checked={!!selection[a]}
                                    type='checkbox' />&nbsp;{a}
                            </label>
                       </li>
                    )}
                </ul>
                </div>;
    }
}

AccountList.displayName = 'AccountList';

// TODO be more specific
AccountList.propTypes = {
    accounts: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.array.isRequired
};