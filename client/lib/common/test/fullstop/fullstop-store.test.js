/* globals expect */
import Immutable from 'immutable';
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import Type from 'common/src/data/fullstop/fullstop-types';
import * as Getter from 'common/src/data/fullstop/fullstop-getter';
import FetchResult from 'common/src/fetch-result';

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

var DEFAULT_STATE = FullstopStore();

describe('The redux fullstop store', () => {
    it('should receive a violation', () => {
        let state = FullstopStore(DEFAULT_STATE, {
                type: Type.FETCH_VIOLATION,
                payload: VIOLATION_A
            }),
            violations = Getter.getViolations(state);
        expect(violations.length).to.equal(1);
        expect(violations[0].id).to.equal(VIOLATION_A.id);
    });

    it('should receive more violations', () => {
        let state = FullstopStore(DEFAULT_STATE, {
            type: Type.FETCH_VIOLATIONS,
            payload: [{
                last: true
            },
            VIOLATIONS]
        });
        expect(Getter.getViolations(state).length).to.equal(VIOLATIONS.length);
    });

    it('should resolve a violation', () => {
        let state = FullstopStore(DEFAULT_STATE, {
            type: Type.FETCH_VIOLATION,
            payload: VIOLATION_A
        });
        state = FullstopStore(state, {
            type: Type.RESOLVE_VIOLATION,
            payload: Object.assign(VIOLATION_A, {comment: 'foo'})
        });
        expect(Getter.getViolations(state).length).to.equal(1);
        expect(Getter.getViolation(state, 3)).to.be.defined;
        let violation = Getter.getViolation(state, 3);
        expect(violation.is_resolved).to.be.true;
        expect(violation.comment).to.equal('foo');
    });

    it('should exchange an existing violation', () => {
        let state = FullstopStore(DEFAULT_STATE, {
            type: Type.FETCH_VIOLATION,
            payload: VIOLATION_A
        });
        state = FullstopStore(state, {
            type: Type.FETCH_VIOLATION,
            payload: Object.assign(VIOLATION_A, {id: 3})
        });
        expect(Getter.getViolations(state).length).to.equal(1);
        expect(Getter.getViolation(state, 3)).to.be.defined;
    });

    it('should have default search parameters', () => {
        let state = FullstopStore(),
            params = Getter.getSearchParams(state);
        expect(params.from).to.be.defined;
        expect(params.to).to.be.defined;
        expect(params.showResolved).to.be.defined;
        expect(params.showUnresolved).to.be.defined;
        expect(params.accounts).to.be.defined;
    });
});