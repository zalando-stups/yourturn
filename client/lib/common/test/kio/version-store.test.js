/* global expect */
import Store from 'common/src/data/kio/kio-store';
import Types from 'common/src/data/kio/kio-types';
import * as Getter from 'common/src/data/kio/kio-getter';
import {Pending, Failed} from 'common/src/fetch-result';

describe('The redux version store', () => {
    it('should receive versions', () => {
        let versions = [{
            application_id: 'kio',
            id: '0.12',
            last_modified: '2015-05-28T16:30:00Z'
        }, {
            application_id: 'kio',
            id: '0.13',
            last_modified: '2015-05-28T16:30:00Z'
        }],
        state = Store(Store(), {
            type: Types.FETCH_APPLICATION_VERSIONS,
            payload: versions
        });
        expect(Getter.getApplicationVersions(state, 'kio').length).to.equal(2);
    });

    it('should receive a single version', () => {
        let version = {
                application_id: 'kio',
                id: '0.12',
                last_modified: '2015-05-28T16:30:00Z'
            },
            state = Store(Store(), {
                type: Types.FETCH_APPLICATION_VERSION,
                payload: version
            });
        expect(Getter.getApplicationVersions(state, 'kio').length).to.equal(1);
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
            }],
            state = Store(Store(), {
                type: Types.FETCH_APPLICATION_VERSIONS,
                payload: results
            }),
            versions = Getter.getApplicationVersions(state, 'kio');
        expect(versions[0].id).to.equal('0.12');
        expect(versions[1].id).to.equal('0.13');
    });

    it('should insert a pending fetch result placeholder', () => {
        let state = Store(Store(), {
                type: Types.BEGIN_FETCH_APPLICATION_VERSION,
                payload: ['kio', '0.12']
            }),
            version = Getter.getApplicationVersion(state, 'kio', '0.12');
        expect(version instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        fetchError.ver = '0.12';
        let state = Store(Store(), {
                type: Types.FAIL_FETCH_APPLICATION_VERSION,
                payload: fetchError
            }),
            kio = Getter.getApplicationVersion(state, 'kio', '0.12');
        expect(kio instanceof Failed).to.be.true;
    });

    it('should return an empty array by default', () => {
        expect(Getter.getApplicationVersions(Store(), 'kio').length).to.equal(0);
    });

    it('should filter by id', () => {
        let versions = [{
                application_id: 'kio',
                id: 'squirrel',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: 'not-a-squirrel',
                last_modified: '2015-05-24T16:30:00Z'
            }],
            state = Store(Store(), {
                type: Types.FETCH_APPLICATION_VERSIONS,
                payload: versions
            }),
            filtered = Getter.getApplicationVersions(state, 'kio', 'a-'),
            unfiltered = Getter.getApplicationVersions(state, 'kio');

        expect(filtered.length).to.equal(1);
        expect(unfiltered.length).to.equal(2);
    });

    it('should return the most recent version', () => {
        let versions = [{
                application_id: 'kio',
                id: 'squirrel',
                last_modified: '2015-05-28T16:30:00Z'
            }, {
                application_id: 'kio',
                id: 'not-a-squirrel',
                last_modified: '2015-05-24T16:30:00Z'
            }],
            state = Store(Store(), {
                type: Types.FETCH_APPLICATION_VERSIONS,
                payload: versions
            }),
            latest = Getter.getLatestApplicationVersion(state, 'kio');
        expect(latest.id).to.equal('squirrel');
    });
});
