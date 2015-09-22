import Immutable from 'immutable';
import * as Getter from 'common/src/data/fullstop/fullstop-getter';

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

describe('The fullstop getter', () => {
    it('#getViolations should filter violations by accounts', () => {
        let state = Immutable.fromJS({
                violations: VIOLATIONS
            }),
            result = Getter.getViolations(state, [VIOLATION_B.account_id]);
        expect(result.length).to.equal(1);
        expect(result[0].id).to.equal(VIOLATION_B.id);
    });

    it('#getViolations should filter violations by resolution', () => {
        let state = Immutable.fromJS({
                violations: VIOLATIONS
            }),
            result = Getter.getViolations(state, null, true);
        expect(result.length).to.equal(1);
        expect(result[0].id).to.equal(VIOLATION_B.id);
    });

    it('#getViolations should filter violations by accounts and resolution', () => {
        let state = Immutable.fromJS({
                violations: VIOLATIONS
            }),
            result = Getter.getViolations(state, [VIOLATION_A.account_id], VIOLATION_B.comment != null);
        expect(result.length).to.equal(0);
    });
});






