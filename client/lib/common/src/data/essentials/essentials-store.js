import {combineReducers} from 'redux';
import resources from './resource-store';
import scopes from './scope-store';
import scopeApps from './application-store';

var EssentialsStore = combineReducers({
    resources,
    scopes,
    scopeApps
});

export default EssentialsStore;
