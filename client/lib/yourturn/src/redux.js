import {createRedux, applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {
    reduxPromiseMiddleware,
    flummoxCompatMiddleware,
    combinedActionSupportMiddleware
} from 'common/src/util';
import NotificationStore from 'common/src/data/notification/notification-store';
import {KioStore} from 'common/src/data/kio/kio-store';
import {TwintipStore} from 'common/src/data/twintip/twintip-store';
import {PieroneStore} from 'common/src/data/pierone/pierone-store';
import {UserStore} from 'common/src/data/user/user-store';
import {MintStore} from 'common/src/data/mint/mint-store';
import {EssentialsStore} from 'common/src/data/essentials/essentials-store';

const logger = createLogger(),
    STORE = combineReducers({
        notifications: NotificationStore,
        user: UserStore,
        kio: KioStore,
        pierone: PieroneStore,
        twintip: TwintipStore,
        mint: MintStore,
        essentials: EssentialsStore
    }),
    createWithMiddleware = applyMiddleware(thunk,
                            combinedActionSupportMiddleware,
                            flummoxCompatMiddleware,
                            reduxPromiseMiddleware,
                            logger)(createStore);

export default createWithMiddleware(STORE);
