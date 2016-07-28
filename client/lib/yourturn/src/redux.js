/* global ENV_DEVELOPMENT */
import {
    applyMiddleware,
    combineReducers,
    createStore
} from 'redux';
import {browserHistory} from 'react-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {syncHistory, routeReducer} from 'redux-simple-router';
import {
    reduxPromiseMiddleware,
    flummoxCompatMiddleware,
    combinedActionSupportMiddleware,
    reduxIdentityMiddleware
} from 'common/src/redux-middlewares';
import NotificationStore from 'common/src/data/notification/notification-store';
import KioStore from 'common/src/data/kio/kio-store';
import TwintipStore from 'common/src/data/twintip/twintip-store';
import PieroneStore from 'common/src/data/pierone/pierone-store';
import UserStore from 'common/src/data/user/user-store';
import MintStore from 'common/src/data/mint/mint-store';
import MagnificentStore from 'common/src/data/magnificent/magnificent-store';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import TeamStore from 'common/src/data/team/team-store';
import SearchStore from 'common/src/data/search/search-store';
import AliceReducer from 'common/src/data/alice/alice-reducer';

const logger = createLogger(),
    STORE = combineReducers({
        notifications: NotificationStore,
        user: UserStore,
        kio: KioStore,
        pierone: PieroneStore,
        twintip: TwintipStore,
        mint: MintStore,
        magnificent: MagnificentStore,
        essentials: EssentialsStore,
        fullstop: FullstopStore,
        team: TeamStore,
        search: SearchStore,
        routing: routeReducer,
        alice: AliceReducer
    }),
    createWithMiddleware = applyMiddleware(
                            syncHistory(browserHistory),
                            // thunk
                            thunk,
                            // allows to dispatch actions based on the result of another actoin
                            combinedActionSupportMiddleware,
                            // dispatches a BEGIN_ action on start of async operation
                            flummoxCompatMiddleware,
                            // dispatches a FAIL_ action on failure of async operation
                            reduxPromiseMiddleware,
                            // logging, but only in dev
                            // reduxIdentityMiddleware
                            ENV_DEVELOPMENT && false ? logger : reduxIdentityMiddleware
                        )(createStore);

export default createWithMiddleware(STORE);
