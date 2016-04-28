/* global expect */

import Immutable from 'immutable';
import * as Getter from 'common/src/data/essentials/essentials-getter';
import {Pending} from 'common/src/fetch-result';

describe('The essentials getter function', () => {
    it('#getAllScopes should return scopes from all resources', () => {
        let state = Immutable.fromJS({
                customer: {
                    read_all: {
                        id: 'read_all'
                    }
                },
                sales_order: {
                    read: {
                        id: 'read'
                    }
                }
            }),
            scopes = Getter.getAllScopes({
                scopes: state
            });
        expect(scopes.length).to.equal(2);
    });

    it('#getResources should not return fetch results', () => {
        let state = Immutable.fromJS({
                customer: {
                    id: 'customer',
                    name: 'Customer'
                },
                sales_order: new Pending()
            }),
            resources = Getter.getResources({
                resources: state
            });
        expect(resources.length).to.equal(1);
        expect(resources[0].id).to.equal('customer');
    });

    it('#getScopes should not return fetch results', () => {
        let state = Immutable.fromJS({
                customer: {
                    read_all: {
                        id: 'read_all'
                    }
                },
                sales_order: {
                    read: new Pending()
                }
            }),
            scopes = Getter.getScopes({
                scopes: state
            }, 'customer');
        expect(scopes.length).to.equal(1);
        expect(scopes[0].id).to.equal('read_all');
    });
});