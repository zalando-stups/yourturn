/* global expect */

import Immutable from 'Immutable';
import {getUserInfo} from 'common/src/data/user/user-getter';

describe('The user getter', () => {
    it('#getUserInfo should return userinfo for the current user', () => {
        let state = Immutable.fromJS({
                tokeninfo: {
                    uid: 'test'
                },
                users: {
                    test: {
                        email: 'test@example.com'
                    }
                }
            }),
            result = getUserInfo(state);
        expect(result).to.be.ok;
        expect(result.email).to.equal('test@example.com');
    });

    it('#getUserInfo should return userinfo for any user', () => {
        let state = Immutable.fromJS({
                users: {
                    test: {
                        email: 'test@example.com'
                    }
                }
            }),
            result = getUserInfo(state, 'test');
        expect(result).to.be.ok;
        expect(result.email).to.equal('test@example.com');
    });
});
