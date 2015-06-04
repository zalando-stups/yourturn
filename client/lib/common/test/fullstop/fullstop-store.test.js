/* globals expect */
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import {Flummox} from 'flummox';

const VIOLATION = {
        'id': 1,
        'created': null,
        'createdBy': null,
        'version': 0,
        'lastModified': null,
        'lastModifiedBy': null,
        'eventId': 'event',
        'accountId': '123',
        'region': 'eu-west-1',
        'message': 'InstanceId: i-id doesn\'t have any userData.',
        'violationObject': null,
        'resolved': false
    };

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

    it('should exchange an existing violation', () => {
        store.receiveViolations([VIOLATION]);
        store.receiveViolation(VIOLATION);
        let violations = store.getViolations();
        expect(violations.length).to.equal(1);
    });
});