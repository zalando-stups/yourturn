/* globals expect */
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import FetchResult from 'common/src/fetch-result';
import {Flummox} from 'flummox';

const VIOLATION_A = {
      id: 1,
      version: 0,
      event_id: '963645c3-1234-1234-1234-7696d09f6993',
      account_id: '123456789',
      region: 'eu-central-1',
      meta_info: 'KeyPair must be blank, but was [\'testmonkey\']',
      comment: null,
      instance_id: null,
      plugin_fully_qualified_class_name: null,
      violation_type: {
        id: 'EC2_WITH_KEYPAIR',
        help_text: 'EC2 instance should not have a ssh key.',
        violation_severity: 0,
        version: 0,
        created: '2015-08-05T09:21:52.297Z',
        created_by: 'npiccolotto',
        last_modified: null,
        last_modified_by: null,
        audit_relevant: true
      },
      created: '2015-06-11T15:39:06.022Z',
      created_by: 'FULLSTOP',
      last_modified: '2015-06-11T15:39:06.022Z',
      last_modified_by: 'FULLSTOP'
    },
    VIOLATION_B = {
      id: 2,
      version: 0,
      event_id: 'd69f8c64-1234-1234-1234-4a7ebb098cfe',
      account_id: '0987654321',
      region: 'eu-central-1',
      meta_info: 'KeyPair must be blank, but was [\'testsanta\']',
      comment: 'This is not the violation you are looking for',
      instance_id: null,
      plugin_fully_qualified_class_name: null,
      violation_type: {
        id: 'EC2_WITH_KEYPAIR',
        help_text: 'EC2 instance should not have a ssh key.',
        violation_severity: 0,
        version: 0,
        created: '2015-08-05T09:21:52.297Z',
        created_by: 'npiccolotto',
        last_modified: null,
        last_modified_by: null,
        audit_relevant: false
      },
      created: '2015-06-11T15:43:22.924Z',
      created_by: 'FULLSTOP',
      last_modified: '2015-06-11T15:43:22.924Z',
      last_modified_by: 'FULLSTOP'
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
        store.receiveViolations([{last: false}, VIOLATIONS]);
        let meta = store.getPagingInfo();
        expect(meta).to.be.ok;
        expect(meta.last).to.be.false;
    });

    it('should set placeholders for page metadata on load', () => {
        store.beginFetchViolations();
        let meta = store.getPagingInfo();
        expect(meta).to.be.ok;
    });
});
