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
        id: 6,
        event_id: '87924782487624-da63-422b-83c1-b7c52497e0c5',
        account_id: '123456789',
        region: 'eu-central-1',
        message: 'Instances with ids: ["i-847167136"] was started with wrong images: [ami-38efd225]',
        comment: null
    },
    {
        id: 7,
        event_id: '87924782487624-da63-422b-83c1-b7c52497e0c5',
        account_id: '123456789',
        region: 'eu-central-1',
        message: 'InstanceId: i-847167136 doesnt have any userData.',
        comment: null
    },
    {
        id: 8,
        event_id: '87924782487624-da63-422b-83c1-b7c52497e0c5',
        account_id: '1029384756',
        region: 'eu-central-1',
        message: 'KeyPair must be blank, but was ["app-pierone"]',
        comment: null
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
