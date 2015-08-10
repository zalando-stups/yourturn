/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import FullstopStore from 'common/src/data/fullstop/fullstop-store';
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import TeamStore from 'common/src/data/team/team-store';
import TeamActions from 'common/src/data/team/team-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import ViolationList from 'violation/src/violation-list/violation-list.jsx';

const FULLSTOP = 'fullstop',
    TEAM = 'team',
    USER = 'user',
    USER_ACCOUNTS = [{
        id: '123456789',
        name: 'stups',
        type: 'aws',
        description: 'STUPS account'
    }],
    ACCOUNTS = [{
        id: '1029384756',
        name: 'acid',
        type: 'aws',
        description: 'ACID Account'
    },
    {
        id: '123456789',
        name: 'stups',
        type: 'aws',
        description: 'STUPS account'
    },
    {
        id: '0987654321',
        name: 'stups-test',
        type: 'aws',
        description: 'STUPS test account'
    }],
    VIOLATIONS = [{
        id: 2445,
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
    {
        id: 2447,
        version: 0,
        event_id: 'd69f8c64-1234-1234-1234-4a7ebb098cfe',
        account_id: '0987654321',
        region: 'eu-central-1',
        meta_info: 'KeyPair must be blank, but was [\'testsanta\']',
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
            audit_relevant: false
        },
        created: '2015-06-11T15:43:22.924Z',
        created_by: 'FULLSTOP',
        last_modified: '2015-06-11T15:43:22.924Z',
        last_modified_by: 'FULLSTOP'
    },
    {
        id: 2448,
        version: 0,
        event_id: 'e83c9bb8-1234-1234-1234-0ec3071796d2',
        account_id: '123456789',
        region: 'eu-central-1',
        meta_info: 'KeyPair must be blank, but was [\'testsanta\']',
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
            audit_relevant: false
        },
        created: '2015-06-11T15:43:23.188Z',
        created_by: 'FULLSTOP',
        last_modified: '2015-06-11T15:43:23.188Z',
        last_modified_by: 'FULLSTOP'
    }];

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FULLSTOP, FullstopActions);
        this.createStore(FULLSTOP, FullstopStore, this);

        this.createActions(TEAM, TeamActions);
        this.createStore(TEAM, TeamStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions(USER, UserActions);
        this.createStore(USER, UserStore, this);
    }
}

describe('The violation list view', () => {
    var flux,
    globalFlux,
    props,
    violationList;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        globalFlux = new GlobalFlux();

        flux
        .getStore(FULLSTOP)
        .receiveViolations([null, VIOLATIONS]);

        flux
        .getStore(TEAM)
        .receiveAccounts(ACCOUNTS);

        globalFlux
        .getStore(USER)
        .receiveAccounts(USER_ACCOUNTS);

        props = {
            flux: flux,
            globalFlux: globalFlux
        };

        violationList = render(ViolationList, props);
    });

    it('should show violations of user accounts', () => {
        let list = TestUtils.findRenderedDOMComponentWithAttributeValue(violationList, 'data-block', 'violation-list');
        expect($(React.findDOMNode(list)).find('[data-block="violation-card"]').length).to.equal(2);
    });
});
