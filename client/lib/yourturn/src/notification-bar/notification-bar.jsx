import React from 'react';
import {connect} from 'react-redux';
import * as Actions from 'common/src/data/notification/notification-actions';
import 'common/asset/less/yourturn/notification-bar.less';

const Notification = (props) => {
        return (
            <li
                onClick={props.onClick}
                className={'type-' + (props.type || 'default')}>
                {props.message}
            </li>)
};

Notification.propTypes = {
    message: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    type: React.PropTypes.string
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
    
    componentWillReceiveProps(nextProps) {
        const { notifications = [] } = nextProps;

        if (!this.state.interval && notifications.length > 0) {
            this.startInterval();
        } else if (this.state.interval && notifications.length == 0) {
            this.stopInterval();
        }
    }

    componentDidMount() {
        /**
         * Continually dismiss old notifications.
         */
        const { notifications = [] } = this.props;
        if (notifications.length > 0) {
            this.startInterval();
        }
    }

    componentWillUnmount() {
        this.stopInterval();
    }

    startInterval() {
        const interval = setInterval(() => {
            this.props.dispatch(Actions.removeNotificationsOlderThan(5000));
        }, 5000);
        this.setState({
            interval
        });
    }

    stopInterval() {
        this.setState({
            interval: false
        });
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

NotificationBar.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    notifications: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        message: React.PropTypes.string
    }))
};

export default connect(state => ({
    notifications: state.notifications
}))(NotificationBar);
