/* globals expect */
import Store from 'common/src/data/notification/store';
import * as Action from 'common/src/data/notification/actions';
import Type from 'common/src/data/notification/action-types';

describe('The notification store', () => {
    it('should receive a notification', () => {
        let msgs = Store([], Action.addNotification('Test message'));
        expect(msgs.length).to.equal(1);

        let msg = msgs[0];
        expect(msg.type).to.equal('default');
        expect(msg.id).to.equal(1);
        expect(msg.created).to.be.defined;
        expect(msg.message).to.equal('Test message');
    });

    // it('should delete a notification by id', () => {
    //     store.receiveNotification(['Test message']);
    //     let {id} = store.getNotifications()[0];
    //     store.deleteNotification(id);
    //     expect(store.getNotifications().length).to.equal(0);
    // });

    // it('should delete old notifications', done => {
    //     store.receiveNotification(['Test message']);
    //     setTimeout(() => {
    //         store.deleteOldNotifications(50);
    //         expect(store.getNotifications().length).to.equal(0);
    //         done();
    //     }, 70);
    // });
});