/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import Form from 'resource/src/resource-form/resource-form';

const RES = 'resource',
    RES_ID = 'sales_order',
    TEST_RES = {
        id: 'sales_order',
        name: 'Sales Order',
        description: 'Sales Orders',
        resource_owners: ['employees']
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(RES, ResourceActions);
        this.createStore(RES, ResourceStore, this);
    }
}

describe('The resource form view', () => {
    var flux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions(RES), 'saveResource', function () {
            return Promise.resolve();
        });
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

        it('should display the available symbol', () => {
            flux.getStore(RES).receiveResource(TEST_RES);
            let $available = form.$el.find('[data-block="available-symbol"]').first();
            expect($available.length).to.equal(1);
        });

        it('should disable the ID input', () => {
            flux.getStore(RES).receiveResource(TEST_RES);
            let $input = form.$el.find('[data-block="id-input"]').first();
            expect($input.is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            flux.getStore(RES).receiveResource(TEST_RES);
            let $input = form.$el.find('[data-block="name-input"]').first();
            $input.val('test');
            form.$el.find('form').submit();
            expect(actionSpy.calledOnce).to.be.true;
        });

    });
});
