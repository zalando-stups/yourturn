/* globals expect */
import {Flummox} from 'flummox';
import StoreWrapper, {NotificationStore} from 'common/src/data/notification/notification-store';
import NotificationActions from 'common/src/data/notification/notification-actions';
import * as Type from 'common/src/data/notification/notification-types';

const FLUX_ID = 'notification';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, NotificationActions);
        this.createStore(FLUX_ID, StoreWrapper, this);
    }
}

describe('The redux notification store', () => {
    it('should return an empty array without action', () => {
        let state = NotificationStore();
        expect(state.length).to.be.defined;
        expect(state.length).to.equal(0);
    });

    it('should receive a notification', () => {
        let state = NotificationStore([], {
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

describe('The notification store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore(FLUX_ID);
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a notification', () => {
        store.receiveNotification(['Hello']);
        let msgs = store.getNotifications();
        expect(msgs.length).to.equal(1);

        let msg = msgs[0];
        expect(msg.type).to.equal('default');
        expect(msg.created).to.be.defined;
        expect(msg.message).to.equal('Hello');
    });

    it('should delete a notification by id', () => {
        store.receiveNotification(['Test message']);
        expect(store.getNotifications().length).to.equal(1);
        let {id} = store.getNotifications()[0];
        store.deleteNotification(id);
        expect(store.getNotifications().length).to.equal(0);
    });

    it('should delete old notifications', done => {
        store.receiveNotification(['Test message']);
        setTimeout(() => {
            store.deleteOldNotifications(50);
            expect(store.getNotifications().length).to.equal(0);
            done();
        }, 70);
    });
});