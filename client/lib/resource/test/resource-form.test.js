/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import Form from 'resource/src/resource-form/resource-form';

const RES = 'resource',
    RES_ID = 'sales_order';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(RES, ResourceActions);
        this.createStore(RES, ResourceStore, this);
    }
}

describe('The resource form view', () => {
    var flux,
        form;

    beforeEach(() => {
        flux = new MockFlux();
    });


    describe('in create mode', () => {
        beforeEach(() => {
            form = new Form({
                flux: flux
            });
        });

        it('should not have a placeholder', () => {
            form.render();
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

    });

    describe('in edit mode', () => {
        beforeEach(() => {
            form = new Form({
                flux: flux,
                 resourceId: RES_ID,
                 edit: true
            });
        });

        it('should not have a placeholder', () => {
            flux.getStore(RES).beginFetchResource(RES_ID);
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

    });
});
