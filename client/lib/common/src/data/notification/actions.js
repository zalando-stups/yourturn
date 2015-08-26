import {createAction} from 'redux-actions';
import Type from './action-types';

let addNotification = createAction(Type.ADD),
    removeNotification = createAction(Type.REMOVE),
    removeNotificationsOlderThan = createAction(Type.REMOVE_OLD);

export {
    addNotification as addNotification,
    removeNotification as removeNotification,
    removeNotificationsOlderThan as removeNotificationsOlderThan
};