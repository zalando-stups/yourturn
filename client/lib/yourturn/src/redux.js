import {createRedux, applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {reduxPromiseMiddleware, flummoxCompatMiddleware} from 'common/src/util';
import NotificationStore from 'common/src/data/notification/notification-store';
import {KioStore} from 'common/src/data/kio/kio-store';
import {TwintipStore} from 'common/src/data/twintip/twintip-store';
import {PieroneStore} from 'common/src/data/pierone/pierone-store';
import {UserStore} from 'common/src/data/user/user-store';

const logger = createLogger(),
    STORE = combineReducers({
        notifications: NotificationStore,
        user: UserStore,
        kio: KioStore,
        pierone: PieroneStore,
        twintip: TwintipStore
    }),
    createWithMiddleware = applyMiddleware(thunk,
                            flummoxCompatMiddleware,
                            reduxPromiseMiddleware,
                            logger)(createStore);

export default createWithMiddleware(STORE);
