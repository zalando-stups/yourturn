/* globals expect */
import Store from 'common/src/data/notification/notification-store';
import Type from 'common/src/data/notification/notification-types';

describe('The redux notification store', () => {
    it('should return an empty array without action', () => {
        let state = Store();
        expect(state.length).to.be.defined;
        expect(state.length).to.equal(0);
    });

    it('should receive a notification', () => {
        let state = Store([], {
            type: Type.ADD_NOTIFICATION,
            payload: ['Hello']
        });
        expect(state.length).equals(1);

        let msg = state[0];
        expect(msg.type).to.equal('default');
        expect(msg.created).to.be.defined;
        expect(msg.message).to.equal('Hello');
    });
});
