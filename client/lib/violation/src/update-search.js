import moment from 'moment';
import {merge} from 'common/src/util';

/**
* Updates search parameters in fullstop store and query params in route.
* @param  {Object} params  The new params
* @param  {Object} context Router context
*/
export default function updateSearch(params, context = this.context, actions = this.actions) {
    actions.updateSearchParams(params);
    Object.keys(params).forEach(k => {
        if (moment.isMoment(params[k])) {
            // dates have to parsed to timestamp again
            params[k] = params[k].toISOString();
        }
    });
    context.router.transitionTo('violation-vioList', {}, merge(context.router.getCurrentQuery(), params));
}
