import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
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
            visible: false,
            range: props.range
        };
    }

    onHeaderClick() {
        this.setState({visible: !this.state.visible});
    }

    handleClickOutside() {
        this.setState({
            visible: false,
            range: this.props.range
        });
    }

    componentWillReceiveProps({range}) {
        this.setState({range});
    }

    onUpdate(_, range) {
        this.setState({range});
        if (this.props.onUpdate && range.length > 1) {
            this.props.onUpdate(range);
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
                        <header>
                            <Timestamp value={this.props.range[0]} format={'YYYY-MM-DD'} /> – <Timestamp value={this.props.range[1]} format={'YYYY-MM-DD'} />
                        </header>
                        <div>
                            <div className='dateDropdown-quickselect'>
                                <small>Quickselect</small>
                                <ul>
                                    <li onClick={() => this.updateWithMinus(1, 'day')}>Yesterday</li>
                                    <li onClick={() => this.updateWithMinus(1, 'week')}>Last 7 days</li>
                                    <li onClick={() => this.updateWithMinus(1, 'month')}>Last 4 weeks</li>
                                    <li onClick={() => this.updateWithMinus(6, 'months')}>Last 6 months</li>
                                    <li onClick={() => this.updateWithMinus(1, 'year')}>Last year</li>
                                </ul>
                            </div>
                            <div className='dateDropdown-container'>
                                <Picker
                                    weekStartDay={1}
                                    range={this.state.range}
                                    onRangeChange={this.onUpdate.bind(this)} />
                            </div>
                        </div>
                    </div> :
                    null}
                </div>;
    }
}

DateDropdown.displayName = 'DateDropdown';

DateDropdown.propTypes = {
    onUpdate: React.PropTypes.func,
    range: React.PropTypes.array,
    title: React.PropTypes.string
};

export default listenToOutsideClick(DateDropdown);
