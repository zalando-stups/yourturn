/* global expect */
import ApplicationStore from 'common/src/data/kio/application-store';
import Types from 'common/src/data/kio/kio-types';
import * as Getter from 'common/src/data/kio/kio-getter';
import {Pending, Failed} from 'common/src/fetch-result';

describe('The redux application store', () => {
    it('should have a fetch status of false by default', () => {
        let state = ApplicationStore();
        expect(Getter.getApplicationsFetchStatus(state)).to.be.false;
    });

    it('should provide a fetch status for applications', () => {
        let state = ApplicationStore();
        state = ApplicationStore(state, {
            type: Types.BEGIN_FETCH_APPLICATIONS
        });
        expect(Getter.getApplicationsFetchStatus(state) instanceof Pending).to.be.true;
    });

    it('should provide a failed fetch status for applications', () => {
        let state = ApplicationStore();
        state = ApplicationStore(state, {
            type: Types.FAIL_FETCH_APPLICATIONS
        });
        expect(Getter.getApplicationsFetchStatus(state) instanceof Failed).to.be.true;
    });

    it('should receive applications', () => {
        let results = [{
                id: 'kio',
                name: 'kio'
            }, {
                id: 'twintip',
                name: 'twintip'
            }],
            state = ApplicationStore(ApplicationStore(), {
                type: Types.RECEIVE_APPLICATIONS,
                payload: results
            });
        expect(Getter.getApplications(state).length).to.equal(2);
    });

    it('should receive a single application', () => {
        let result = {
                id: 'kio',
                name: 'kio'
            },
            state = ApplicationStore(ApplicationStore(), {
                type: Types.RECEIVE_APPLICATION,
                payload: result
            });
        expect(Getter.getApplications(state).length).to.equal(1);
    });

    it('should insert a pending fetch result placeholder', () => {
        let state = ApplicationStore(ApplicationStore(), {
                type: Types.BEGIN_FETCH_APPLICATION,
                payload: 'kio'
            }),
            kio = Getter.getApplication(state, 'kio');
        expect(kio instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        let state = ApplicationStore(ApplicationStore(), {
                type: Types.FAIL_FETCH_APPLICATION,
                payload: fetchError
            }),
            kio = Getter.getApplication(state, 'kio');
        expect(kio instanceof Failed).to.be.true;
    });
});