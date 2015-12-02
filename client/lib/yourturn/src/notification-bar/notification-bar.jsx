import React from 'react';
import {connect} from 'react-redux';
import * as Actions from 'common/src/data/notification/notification-actions';
import 'common/asset/less/yourturn/notification-bar.less';

class Notification extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <li
                onClick={this.props.onClick}
                className={'type-' + (this.props.type || 'default')}>{this.props.message}</li>;
    }
}
Notification.propTypes = {
    type: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired
};
Notification.displayName = 'Notification';

// ========

class NotificationBar extends React.Component {
    constructor() {
        super();
        this.state = {
            interval: false
        };
    }

    dismiss(id) {
        this.props.dispatch(Actions.removeNotification(id));
    }

    componentDidMount() {
        /**
         * Continually dismiss old notifications.
         */
        let interval = setInterval(() => {
            this.props.dispatch(Actions.removeNotificationsOlderThan(5000));
        }, 5000);
        this.setState({
            interval
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
        let {notifications} = this.props;
        if (notifications.length) {
            return <div className='notificationBar'>
                        <ul>
                            {notifications.map(
                                n => <Notification
                                        onClick={this.dismiss.bind(this, n.id)}
                                        key={n.id}
                                        type={n.type}
                                        message={n.message} />
                            )}
                        </ul>
                    </div>;
        }
        return null;
    }
}
NotificationBar.displayName = 'NotificationBar';


export default connect(state => ({notifications: state.notifications}))(NotificationBar);
