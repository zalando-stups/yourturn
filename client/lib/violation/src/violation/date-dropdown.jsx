import React from 'react';
import Icon from 'react-fa';
import moment from 'moment';
import Picker from 'react-date-picker';
import 'react-date-picker/index.css';
import 'common/asset/less/violation/date-dropdown.less';
import listenToOutsideClick from 'react-onclickoutside/decorator';

class DateDropdown extends React.Component {
    constructor(props) {
        super();
        this.state = {
            outsideClickHandler: null,
            visible: false
        };
    }

    onHeaderClick() {
        this.state.visible = !this.state.visible;
        this.setState(this.state);
    }

    handleClickOutside() {
        this.setState({
            visible: false
        });
    }

    onUpdate(stringRange, momentRange) {
        if (this.props.onUpdate) {
            this.props.onUpdate(momentRange);
        }
    }

    updateWithMinus(howMany, what) {
        this.props.onUpdate([moment().subtract(howMany, what).startOf('day'), moment()]);
    }

    render() {
        return <div ref='dropdown' className='date-dropdown'>
                <header
                    ref='header'
                    onClick={this.onHeaderClick.bind(this)}>
                    <Icon name='filter' fixedWidth />
                    <span>{this.props.title}</span>
                    <Icon name='caret-down' fixedWidth />
                </header>
                {this.state.visible ?
                    <div className='dateDropdown-dropdown'>
                        <div className='dateDropdown-quickselect'>
                            <small>Quickselect</small>
                            <ul>
                                <li onClick={() => this.updateWithMinus(1, 'day')}>Yesterday</li>
                                <li onClick={() => this.updateWithMinus(1, 'week')}>Last week</li>
                                <li onClick={() => this.updateWithMinus(1, 'month')}>Last month</li>
                                <li onClick={() => this.updateWithMinus(6, 'months')}>Last 6 months</li>
                                <li onClick={() => this.updateWithMinus(1, 'year')}>Last year</li>
                            </ul>
                        </div>
                        <div className='dateDropdown-container'>
                            <Picker
                                weekStartDay={1}
                                onRangeChange={this.onUpdate.bind(this)}
                                range={this.props.range} />
                        </div>
                    </div> :
                    null}
                </div>;
    }
}
DateDropdown.displayName = 'DateDropdown';

export default listenToOutsideClick(DateDropdown);
