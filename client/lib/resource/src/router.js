import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import ResourceList from './resource-list/resource-list';
import ResourceForm from './resource-form/resource-form';
import ResouceDetail from './resource-detail/resource-detail';
import ScopeForm from './scope-form/scope-form';
import ScopeDetail from './scope-detail/scope-detail';
import Error from 'common/src/error.hbs';
import Config from 'common/src/config';
import Flux from './flux';
import 'promise.prototype.finally';

const RES_FLUX = new Flux(),
      RES_ACTIONS = RES_FLUX.getActions('resource'),
      MAIN_VIEW_ID = '#yourturn-view';

// QUICKFIX #133
function isWhitelisted(token) {
    // ignore whitelist if it's empty
    if (Config.RESOURCE_WHITELIST.length === 0) {
        return true;
    }
    return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
}

// QUICKFIX #133
function rejectIfNotWhitelisted(globalFlux) {
    return new Promise((resolve, reject) => {
        let token = globalFlux.getStore('user').getTokenInfo();
        if (!token.uid) {
            globalFlux
            .getActions('user')
            .fetchTokenInfo()
            .then(token => {
                if (!isWhitelisted(token)) {
                    let error = new Error();
                    error.name = 'Not whitelisted';
                    error.message = 'You are not allowed to view this page. Sorry!';
                    error.status = 'u1F62D';
                    reject(error);
                } else {
                    resolve();
                }
            })
            .catch(err => {
                reject(err);
            });
        } else if (!isWhitelisted(token)) {
            let error = new Error();
            error.name = 'Not whitelisted';
            error.message = 'You are not allowed to view this page. Sorry!';
            error.status = 'u1F62D';
            reject(error);
        } else {
            resolve();
        }
    });
}

class ResourceRouter extends Router {
    constructor(props) {
        super({
            routes: {
                'resource': 'listResources',
                'resource/create': 'createResource',
                'resource/detail/:id': 'listResource',
                'resource/edit/:id': 'editResource',
                'resource/detail/:id/scope/create': 'createScope',
                'resource/detail/:id/scope/detail/:scope': 'listScope',
                'resource/detail/:id/scope/edit/:scope': 'editScope'
            }
        });
        this.globalFlux = props.globalFlux;
    }

    /**
     * Lists available resources.
     */
    listResources() {
        Promise.all([
            RES_ACTIONS.fetchResources(),
            rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        ])
        .then(() => puppeteer.show(new ResourceList({
            flux: RES_FLUX
        }), MAIN_VIEW_ID))
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows form to create a new resource
     */
    createResource() {
        Promise.all([
            RES_ACTIONS.fetchResources(),
            rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        ])
        .then(() => puppeteer.show(new ResourceForm({
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification')
        }), MAIN_VIEW_ID))
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows form to edit a resource
     * @param  {String} resourceId ID of the resource
     */
    editResource(resourceId) {
        Promise.all([
            RES_ACTIONS.fetchResource(resourceId),
            rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        ])
        .then(() => puppeteer.show(new ResourceForm({
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification'),
            resourceId: resourceId,
            edit: true
        }), MAIN_VIEW_ID))
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows detailed view of this resource
     * @param  {string} resourceId ID of the resource in question
     */
    listResource(resourceId) {
        rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        .then(() => {
            RES_ACTIONS.fetchResource(resourceId);
            RES_ACTIONS.fetchScopes(resourceId);
            puppeteer.show(new ResouceDetail({
                resourceId: resourceId,
                flux: RES_FLUX
            }), MAIN_VIEW_ID);    
        });
    }

    /**
     * Shows form to create a new scope for a resource.
     * @param  {string} resourceId ID of the resource to add this scope to.
     */
    createScope(resourceId) {
        Promise.all([
            RES_ACTIONS.fetchResource(resourceId),
            RES_ACTIONS.fetchScopes(resourceId),
            rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        ])
        .then(() => puppeteer.show(new ScopeForm({
            resourceId: resourceId,
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification')
        }), MAIN_VIEW_ID))
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows detailed view of this scope.
     * @param  {string} resourceId The ID of the scope’s resource.
     * @param  {string} scopeId The ID of the scope
     */
    listScope(resourceId, scopeId) {
        rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        .then(() => {
            RES_ACTIONS.fetchScope(resourceId, scopeId);
            RES_ACTIONS.fetchScopeApplications(resourceId, scopeId);
            puppeteer.show(new ScopeDetail({
                resourceId: resourceId,
                scopeId: scopeId,
                flux: RES_FLUX
            }), MAIN_VIEW_ID);
        });
    }

    /**
     * Shows form to edit a scope for a resource.
     * @param  {string} resourceId ID of the resource this scope belongs to.
     * @param  {string} scopeId ID of the scope to edit.
     */
    editScope(resourceId, scopeId) {
        Promise.all([
            RES_ACTIONS.fetchResource(resourceId),
            RES_ACTIONS.fetchScopes(resourceId),
            rejectIfNotWhitelisted(this.globalFlux) // QUICKFIX #133
        ])
        .then(() => {
            puppeteer.show(new ScopeForm({
                resourceId: resourceId,
                scopeId: scopeId,
                edit: true,
                flux: RES_FLUX,
                notificationActions: this.globalFlux.getActions('notification')
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));

    }
}

export default ResourceRouter;
