/* global expect */
import Immutable from 'immutable';
import * as Getter from 'common/src/data/kio/kio-getter';
import {Pending} from 'common/src/fetch-result';

describe('The kio getter functions', () => {
    it('#getApplications should filter applications by id', () => {
        let state = Immutable.fromJS({
            applications: {
                kio: {
                    id: 'kio',
                    name: 'kio',
                    team_id: 'stups'
                },
                twintip: {
                    id: 'twintip',
                    name: 'twintip',
                    team_id: 'stups'
                }
            }
        });
        state = {
            applications: state
        };
        expect(Getter.getApplications(state, 'kio').length).to.equal(1);
        expect(Getter.getApplications(state, 'Kio').length).to.equal(1);
        expect(Getter.getApplications(state, 'other').length).to.equal(0);
    });

    it('#getApplications should filter applications by team_id', () => {
        let state = Immutable.fromJS({
            applications: {
                kio: {
                    id: 'kio',
                    name: 'kio',
                    team_id: 'greendale'
                },
                twintip: {
                    id: 'twintip',
                    name: 'twintip',
                    team_id: 'stups'
                }
            }
        });
        state = {
            applications: state
        };
        expect(Getter.getApplications(state, 'stups').length).to.equal(1);
        expect(Getter.getApplications(state, 'greendale').length).to.equal(1);
    });

    it('#getApplications should sort applications by name asc', () => {
        let state = Immutable.fromJS({
                applications: {
                    kio: {
                        id: 'kio',
                        name: 'BBB'
                    },
                    twintip: {
                        id: 'twintip',
                        name: 'aaa'
                    }
                }
            }),
            apps = Getter.getApplications({
                applications: state
            });
        expect(apps[0].name).to.equal('aaa');
        expect(apps[1].name).to.equal('BBB');
    });

    it('#getApplications should not give out fetch results', () => {
        let state = Immutable.fromJS({
            applications: {
                kio: new Pending(),
                twintip: {
                    id: 'twintip',
                    name: 'twintip'
                }
            }
        });
        state = {
            applications: state
        };
        expect(Getter.getApplications(state).length).to.equal(1);
    });
});