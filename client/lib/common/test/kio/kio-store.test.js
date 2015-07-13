/* globals expect */
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);
    }
}

describe('The kio store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('kio');
    });

    afterEach(() => {
        store._empty();
    });

    describe('applications', () => {
        it('should receive applications', () => {
            let results = [{
                id: 'kio',
                name: 'kio'
            }, {
                id: 'twintip',
                name: 'twintip'
            }];
            store.receiveApplications(results);
            expect(store.getApplications().length).to.equal(2);
        });

        it('should filter applications', () => {
            let results = [{
                id: 'kio',
                name: 'kio'
            }, {
                id: 'twintip',
                name: 'twintip'
            }];
            store.receiveApplications(results);
            expect(store.getApplications('kio').length).to.equal(1);
            expect(store.getApplications('Kio').length).to.equal(1);
            expect(store.getApplications('other').length).to.equal(0);
        });

        it('should receive applications that match a list of team ids', () => {
            let results = [{
                id: 'kio',
                name: 'kio',
                team_id: 'stups'
            }, {
                id: 'twintip',
                name: 'twintip',
                team_id: 'stups'
            }, {
                id: 'openam',
                name: 'OpenAM',
                team_id: 'iam'
            }];
            store.receiveApplications(results);
            expect(store.getTeamApplications(null, ['stups']).length).to.equal(2);
        });

        it('should receive applications that dont match a list of team ids', () => {
            let results = [{
                id: 'kio',
                name: 'kio',
                team_id: 'stups'
            }, {
                id: 'twintip',
                name: 'twintip',
                team_id: 'stups'
            }, {
                id: 'openam',
                name: 'OpenAM',
                team_id: 'iam'
            }];
            store.receiveApplications(results);
            expect(store.getOtherApplications(null, ['stups']).length).to.equal(1);
        });


        it('should receive a single application', () => {
            let result = {
                id: 'kio',
                name: 'kio'
            };
            store.receiveApplication(result);
            expect(store.getApplications().length).to.equal(1);
        });

        it('should sort applications by name asc', () => {
            let results = [{
                id: 'kio',
                name: 'BBB'
            }, {
                id: 'twintip',
                name: 'aaa'
            }];
            store.receiveApplications(results);
            let apps = store.getApplications();
            expect(apps[0].name).to.equal('aaa');
            expect(apps[1].name).to.equal('BBB');
        });

        it('should insert a pending fetch result placeholder', () => {
            store.beginFetchApplication('kio');
            let kio = store.getApplication('kio');
            expect(kio instanceof Pending).to.be.true;
        });

        it('should insert a failed fetch result placeholder', () => {
            let fetchError = new Error();
            fetchError.id = 'kio';
            store.failFetchApplication(fetchError);
            let kio = store.getApplication('kio');
            expect(kio instanceof Failed).to.be.true;
        });

        it('should not give out fetch results', () => {
            let results = [{
                id: 'kio',
                name: 'kio'
            }];

            store.receiveApplications(results);
            store.beginFetchApplication('twintip');

            expect(store.getApplications().length).to.equal(1);
        });

        it('should return an empty array by default', () => {
            expect(store.getApplications().length).to.equal(0);
        });
    });

    describe('versions', () => {
        it('should receive versions', () => {
            let versions = [{
                application_id: 'kio',
                id: '0.12',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: '0.13',
                last_modified: '2015-05-28T16:30:00Z'
            }];
            store.receiveApplicationVersions(versions);
            expect(store.getApplicationVersions('kio').length).to.equal(2);
        });

        it('should receive a single version', () => {
            let version = {
                application_id: 'kio',
                id: '0.12',
                last_modified: '2015-05-28T16:30:00Z'
            };
            store.receiveApplicationVersion(version);
            expect(store.getApplicationVersions('kio').length).to.equal(1);
        });

        it('should sort versions by last_modified desc', () => {
            let results = [{
                application_id: 'kio',
                id: '0.12',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: '0.13',
                last_modified: '2015-05-24T16:30:00Z'
            }];
            store.receiveApplicationVersions(results);
            let versions = store.getApplicationVersions('kio');
            expect(versions[0].id).to.equal('0.12');
            expect(versions[1].id).to.equal('0.13');
        });

        it('should insert a pending fetch result placeholder', () => {
            store.beginFetchApplicationVersion('kio', '0.12');
            let version = store.getApplicationVersion('kio', '0.12');
            expect(version instanceof Pending).to.be.true;
        });

        it('should insert a failed fetch result placeholder', () => {
            let fetchError = new Error();
            fetchError.id = 'kio';
            fetchError.ver = '0.12';
            store.failFetchApplicationVersion(fetchError);
            let kio = store.getApplicationVersion('kio', '0.12');
            expect(kio instanceof Failed).to.be.true;
        });

        it('should return an empty array by default', () => {
            expect(store.getApplicationVersions('kio').length).to.equal(0);
        });

        it('should filter properly', () => {
            store.receiveApplicationVersions([{
                application_id: 'kio',
                id: 'squirrel',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: 'not-a-squirrel',
                last_modified: '2015-05-24T16:30:00Z'
            }]);
            let filtered = store.getApplicationVersions('kio', 'a-');
            expect(filtered.length).to.equal(1);
            let unfiltered = store.getApplicationVersions('kio');
            expect(unfiltered.length).to.equal(2);
        });

        it('should return the most recent version', () => {
            store.receiveApplicationVersions([{
                application_id: 'kio',
                id: 'squirrel',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: 'not-a-squirrel',
                last_modified: '2015-05-24T16:30:00Z'
            }]);
            let latest = store.getLatestApplicationVersion('kio');
            expect(latest.id).to.equal('squirrel');
        });
    });

    describe('approvals', () => {
        it('should receive approvals', () => {
            let approvals = [{
                application_id: 'kio',
                version_id: '0.12',
                user_id: 'test',
                approval_type: 'TESTED',
                approved_at: '2015-04-26T01:40:17Z'
            }, {
                application_id: 'kio',
                version_id: '0.12',
                user_id: 'test',
                approval_type: 'DEPLOY',
                approved_at: '2015-04-26T01:37:17Z'
            }];
            store.receiveApprovals(['kio', '0.12', approvals]);
            expect(store.getApprovals('kio', '0.12').length).to.equal(2);
        });

        it('should sort approvals by date asc', () => {
            let results = [{
                application_id: 'kio',
                version_id: '0.12',
                user_id: 'test',
                approval_type: 'TESTED',
                approved_at: '2015-04-26T01:40:17Z'
            }, {
                application_id: 'kio',
                version_id: '0.12',
                user_id: 'test',
                approval_type: 'DEPLOY',
                approved_at: '2015-04-26T01:37:17Z'
            }];
            store.receiveApprovals(['kio', '0.12', results]);
            let approvals = store.getApprovals('kio', '0.12');
            expect(approvals[0].approval_type).to.equal('DEPLOY');
            expect(approvals[1].approval_type).to.equal('TESTED');
        });

        it('should return an empty array by default', () => {
            expect(store.getApprovals('kio', '0.12').length).to.equal(0);
        });
    });
});
