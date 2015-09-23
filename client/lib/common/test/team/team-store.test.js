/* globals expect */
import TeamStoreWrapper, {TeamStore} from 'common/src/data/team/team-store';
import TeamActions from 'common/src/data/team/team-actions';
import Types from 'common/src/data/team/team-types';
import {Flummox} from 'flummox';

const ACCOUNTS = [{
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
    }];

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('team', TeamActions);
        this.createStore('team', TeamStoreWrapper, this);
    }
}

describe('The team redux store', () => {
    it('should receive accounts', () => {
        let state = TeamStore();
        state = TeamStore(state, {
            type: Types.RECEIVE_ACCOUNTS,
            payload: ACCOUNTS
        });
        expect(state.count()).to.equal(ACCOUNTS.length);
    });
});

describe('The team store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('team');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive accounts', () => {
        store.receiveAccounts(ACCOUNTS);
        let accounts = store.getAccounts();
        expect(accounts.length).to.equal(ACCOUNTS.length);
    });
});