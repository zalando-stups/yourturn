/* globals expect */
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import {Flummox} from 'flummox';

const VIOLATION = {
        'id': 1,
        'created': null,
        'created_by': null,
        'version': 0,
        'last_modified': null,
        'last_modified_by': null,
        'event_id': 'event',
        'account_id': '123',
        'region': 'eu-west-1',
        'message': 'InstanceId: i-id doesn\'t have any userData.',
        'violation_object': null,
        'resolved': false
    },
    VIOLATIONS = [VIOLATION, {
        'id': 2,
        'created': null,
        'created_by': null,
        'version': 0,
        'last_modified': null,
        'last_modified_by': null,
        'event_id': 'event',
        'account_id': '123',
        'region': 'eu-central-1',
        'message': 'InstanceId: i-id doesn\'t have any userData.',
        'violation_object': null,
        'resolved': false
    }];

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('fullstop', FullstopActions);
        this.createStore('fullstop', FullstopStore, this);
    }
}

describe('The fullstop store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('fullstop');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive violations', () => {
        store.receiveViolations([VIOLATION]);
        let violations = store.getViolations();
        expect(violations.length).to.equal(1);
    });

    it('should return a single violation', () => {
        store.receiveViolations([VIOLATION]);
        let violation = store.getViolation(VIOLATION.id);
        expect(violation).to.be.ok;
    });

    it('should not contain duplicate violations', () => {
        store.receiveViolations(VIOLATIONS);
        expect(store.getViolations().length).to.equal(2);
        store.receiveViolations(VIOLATIONS);
        expect(store.getViolations().length).to.equal(2);
    });

    it('should exchange an existing violation', () => {
        store.receiveViolations([VIOLATION]);
        store.receiveViolation(VIOLATION);
        let violations = store.getViolations();
        expect(violations.length).to.equal(1);
    });
});