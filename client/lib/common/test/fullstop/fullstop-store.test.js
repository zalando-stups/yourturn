/* globals expect */
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import FetchResult from 'common/src/fetch-result';
import {Flummox} from 'flummox';

const VIOLATION_A = {
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
        'comment': null
    },
    VIOLATION_B = {
        'id': 2,
        'created': null,
        'created_by': null,
        'version': 0,
        'last_modified': null,
        'last_modified_by': null,
        'event_id': 'event',
        'account_id': '321',
        'region': 'eu-central-1',
        'message': 'InstanceId: i-id doesn\'t have any userData.',
        'violation_object': null,
        'comment': 'alright'
    },
    VIOLATIONS = [VIOLATION_A, VIOLATION_B];

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

    it('should insert a pending result for a violation', () => {
        store.beginFetchViolation(VIOLATION_A.id);
        let violation = store.getViolation(VIOLATION_A.id);
        expect(violation instanceof FetchResult).to.be.true;
        expect(violation.isPending()).to.be.true;
    });

    it('should insert a failed result for a violation', () => {
        let err = new Error();
        err.violationId = VIOLATION_A.id;
        store.failFetchViolation(err);
        let violation = store.getViolation(VIOLATION_A.id);
        expect(violation instanceof FetchResult).to.be.true;
        expect(violation.isFailed()).to.be.true;
    });

    it('should receive violations', () => {
        store.receiveViolations([null, [VIOLATION_A]]);
        let violations = store.getViolations();
        expect(violations.length).to.equal(1);
    });

    it('should return a single violation', () => {
        store.receiveViolation(VIOLATION_A);
        let violation = store.getViolation(VIOLATION_A.id);
        expect(violation).to.be.ok;
    });

    it('should not contain duplicate violations', () => {
        store.receiveViolations([null, VIOLATIONS]);
        expect(store.getViolations().length).to.equal(2);
    });

    it('should exchange an existing violation', () => {
        store.receiveViolations([null, [VIOLATION_A]]);
        store.receiveViolation(VIOLATION_A);
        let violations = store.getViolations();
        expect(violations.length).to.equal(1);
    });

    it('should filter violations by accounts', () => {
        store.receiveViolations([null, VIOLATIONS]);
        let violations = store.getViolations([VIOLATION_B.account_id]);
        expect(violations.length).to.equal(1);
        expect(violations[0].id).to.equal(VIOLATION_B.id);
    });

    it('should filter violations by resolution', () => {
        store.receiveViolations([null, VIOLATIONS]);
        let violations = store.getViolations(null, true);
        expect(violations.length).to.equal(1);
        expect(violations[0].id).to.equal(VIOLATION_B.id);
    });

    it('should filter violations by accounts and resolution', () => {
        store.receiveViolations([null, VIOLATIONS]);
        let violations = store.getViolations([VIOLATION_A.account_id], VIOLATION_B.comment != null);
        expect(violations.length).to.equal(0);
    });

    it('should store page metadata info', () => {
        store.receiveViolations([{number: 0}, VIOLATIONS]);
        let meta = store.getPagingInfo();
        expect(meta).to.be.ok;
        expect(meta.page).to.equal(0);
    });

    it('should set placeholders for page metadata on load', () => {
        store.beginFetchViolations();
        let meta = store.getPagingInfo();
        expect(meta).to.be.ok;
    });
});
