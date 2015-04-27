/* globals expect */

import NotificationStore from 'common/src/data/notification/notification-store';
import NotificationActions from 'common/src/data/notification/notification-actions';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

const FLUX_ID = 'notification';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, NotificationActions);
        this.createStore(FLUX_ID, NotificationStore, this);
    }
}

describe('The notification store', () => {
    let store,
        actions,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore(FLUX_ID);
        actions = flux.getActions(FLUX_ID);
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a notification', () => {
        store.receiveNotification(['Test message']);
        let msgs = store.getNotifications();
        expect(msgs.length).to.equal(1);

        let msg = msgs[0];
        expect(msg.type).to.equal('default');
        expect(msg.id).to.equal(1);
        expect(msg.created).to.be.defined;
        expect(msg.message).to.equal('Test message');
    });

    it('should delete a notification by id', () => {
        store.receiveNotification(['Test message']);
        let {id} = store.getNotifications()[0];
        store.deleteNotification(id);
        expect(store.getNotifications().length).to.equal(0);
    });

    it('should delete old notifications', done => {
        store.receiveNotification(['Test message']);
        window.setTimeout(() => {
            store.deleteOldNotifications(300);
            expect(store.getNotifications().length).to.equal(0);
            done();
        }, 500);
    });
});