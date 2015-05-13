/* globals expect */
import TeamStore from 'common/src/data/team/team-store';
import TeamActions from 'common/src/data/team/team-actions';
import {Flummox} from 'flummox';

const FLUX = 'team';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, TeamActions);
        this.createStore(FLUX, TeamStore, this);
    }
}

describe('The team store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore(FLUX);
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive teams', () => {
        store.receiveUserTeams(['npiccolotto', [{
            id: 'stups'
        }]]);
        expect(store.getUserTeams('npiccolotto')).to.not.be.undefined;
        expect(store.getUserTeams('npiccolotto').length).to.equal(1);
    });
});