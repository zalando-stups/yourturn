import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppRoutes from 'application/src/router.react.jsx';
import ResRoutes from 'resource/src/router.react.jsx';
import VioRoutes from 'violation/src/router.react.jsx';
import YourTurn from './app.jsx';
import Search from 'yourturn/src/search/search.jsx';
import DefaultError from 'common/src/error.jsx';

import REDUX from 'yourturn/src/redux';
import {connect} from 'react-redux';
import {
    bindActionsToStore,
    bindGettersToState
} from 'common/src/util';

import * as SearchGetter from 'common/src/data/search/search-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as SearchActions from 'common/src/data/search/search-actions';
import * as FullstopActions from 'common/src/data/fullstop/fullstop-actions';

import {Provider} from 'common/src/oauth-provider';
import {Error} from '@zalando/oauth2-client-js';
import validate from './validate-oauth-response';

const USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      FULLSTOP_ACTIONS = bindActionsToStore(REDUX, FullstopActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      SEARCH_ACTIONS = bindActionsToStore(REDUX, SearchActions);

class LoginHandler extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        let response;
        try {
            response = Provider.parse(window.location.hash);
        } catch (err) {
            NOTIFICATION_ACTIONS
            .addNotification(
                'OAuth: Unexpected response. This should not happen.',
                'error');
            return this.context.router.push('/');
        }
        if (response) {
            if (response instanceof Error) {
                return NOTIFICATION_ACTIONS
                            .addNotification(
                                'OAuth: ' + response.error + ' ' + response.getMessage(),
                                'error');
            }
            // successful response with access_token
            // validate with business logic
            validate(USER_ACTIONS)
                .then(info => {
                    // everything's good!
                    // run the same stuff from bootstrap now
                    USER_ACTIONS
                        .fetchAccounts(info.uid)
                        .then(accounts => {
                            FULLSTOP_ACTIONS.fetchOwnTotal(accounts.map(a => a.id));
                        });
                    USER_ACTIONS.fetchUserInfo(info.uid);

                    this.context.router.push(response.metadata.route || '/');
                })
                .catch(e => {
                    // delete tokens
                    USER_ACTIONS.deleteTokenInfo();
                    return NOTIFICATION_ACTIONS
                            .addNotification(
                                'Token validation failed: ' + e.message,
                                'error');
                });
        }
    }

    render() {
        return null;
    }
}
LoginHandler.displayName = 'LoginHandler';
LoginHandler.contextTypes = {
    router: React.PropTypes.func.isRequired
};


const SearchHandler = (props) => {
    return (<Search
                searchActions={SEARCH_ACTIONS}
                {...props} />)
};
SearchHandler.displayName = 'SearchHandler';
let ConnectedSearchHandler = connect(state => ({
    searchStore: bindGettersToState(state.search, SearchGetter)
}))(SearchHandler);

const ErrorHandler = (props) => {
    return <DefaultError error={props.location.state} />
};
ErrorHandler.displayName = 'ErrorHandler';
ErrorHandler.propTypes = {
    location: React.PropTypes.shape({
        state: React.PropTypes.string
    })
};

const ROUTES =
    <Route component={YourTurn} path='/'>
        {AppRoutes}
        {ResRoutes}
        {VioRoutes}
        <IndexRoute component={ConnectedSearchHandler} />
        <Route path='oauth' component={LoginHandler} />
        <Route path='error' component={ErrorHandler} />
    </Route>;

export default ROUTES;
