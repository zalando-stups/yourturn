import React from 'react';
import Icon from 'react-fa';
import Picker from 'react-date-picker';
import 'react-date-picker/index.css';
import 'common/asset/less/violation/date-dropdown.less';

class DateDropdown extends React.Component {
    constructor(props) {
        super();
        this.state = {
            outsideClickHandler: null,
            visible: false
        };
    }

    // https://github.com/Pomax/react-onclickoutside/blob/master/index.js
    // maybe also use this library in the future as
    // uses only one event listener for multiple components
    componentDidMount() {
        var that = this,
            handler = function(evt) {
                var src = evt.target,
                    self = that.refs.dropdown,
                    found = false;
                while(src.parentNode) {
                    found = src.parentNode === self;
                    if (found) {
                        return;
                    }
                    src = src.parentNode;
                }
                that.setState({
                    visible: false
                });
            };
        document.body.addEventListener('click', handler);
        this.setState({
            outsideClickHandler: handler
        });
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.state.outsideClickHandler);
    }

    onHeaderClick() {
        this.state.visible = !this.state.visible;
        this.setState(this.state);
    }

    // https://github.com/Pomax/react-onclickoutside/blob/master/index.js
    // maybe also use this library in the future as
    // uses only one event listener for multiple components
    componentDidMount() {
        var that = this,
            handler = function(evt) {
                var src = evt.target,
                    self = that.refs.dropdown,
                    found = false;
                while(src.parentNode) {
                    found = src.parentNode === self;
                    if (found) {
                        return;
                    }
                    src = src.parentNode;
                }
                that.setState({
                    visible: false
                });
            };
        document.body.addEventListener('click', handler);
        this.setState({
            outsideClickHandler: handler
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.state.outsideClickHandler);
    }

    onUpdate(stringRange, momentRange) {
        if (this.props.onUpdate) {
            this.props.onUpdate(momentRange);
        }
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
                        <div className='dateDropdown-container'>
                            <Picker
                                weekStartDay={1}
                                onRangeChange={this.onUpdate.bind(this)}
                                defaultRange={this.props.range} />
                        </div>
                    </div> :
                    null}
                </div>;
    }
}
DateDropdown.displayName = 'DateDropdown';

export default DateDropdown;
