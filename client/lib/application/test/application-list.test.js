/* globals expect, $, TestUtils, reset, render, React */
import _ from 'lodash';

import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import List from 'application/src/application-list/application-list.jsx';
import {bindGettersToState} from 'common/src/util';

describe('The application list view', () => {
    var props,
        list;


    beforeEach(() => {
        reset();
        
        let kioState = KioStore(),
            userState = UserStore(UserStore(), {
                type: UserTypes.FETCH_USERACCOUNTS,
                payload: [{
                    id: '123',
                    name: 'stups'
                }]
            }),
            kioActions = Object.assign({}, KioActions);

        props = {
            userStore: bindGettersToState(userState, UserGetter),
            kioStore: bindGettersToState(kioState, KioGetter),
            kioActions
        };

        list = render(List, props);
    });

    it('should not display any list of applications', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
        }).to.throw();
    });

    // FIXME replace content with tests for account app list
    // it('should display a list of applications owned by user and no list of not owned by user', () => {
    //     flux
    //     .getStore('kio')
    //     .receiveApplications([{
    //         id: 'kio',
    //         name: 'Kio',
    //         team_id: 'stups',
    //         active: true
    //     }, {
    //         id: 'yourturn',
    //         name: 'Yourturn',
    //         team_id: 'stups',
    //         active: true
    //     }]);

    //     list = render(List, props);
    //     let teamApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
    //     expect($(React.findDOMNode(teamApps)).children().length).to.equal(2);

    //     expect(() => {
    //         TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
    //     }).to.throw();
    // });

    it('should display a list of applications not owned by the user and no list of owned by user', () => {
        let kioState = KioStore(KioStore(), {
            type: KioTypes.FETCH_APPLICATIONS,
            payload: [{
                id: 'openam',
                name: 'OpenAM',
                team_id: 'iam',
                active: true
            }]
        });
        props.kioStore = bindGettersToState(kioState, KioGetter);

        list = render(List, props);
        let otherApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');
        expect($(React.findDOMNode(otherApps)).children().length).to.equal(1);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
    });

    it('should display the number of hidden applications on the not owned applications list', () => {
        let app = {
                name: 'Open AM',
                team_id: 'iam'
            },
            apps = _.times(25, n => _.extend({id: n}, app), []);

        let kioState = KioStore(KioStore(), {
            type: KioTypes.FETCH_APPLICATIONS,
            payload: apps
        });
        props.kioStore = bindGettersToState(kioState, KioGetter);

        list = render(List, props);
        let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'show-inactive-checkbox'),
            otherApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');

        TestUtils.Simulate.change(checkbox); // show inactive apps

        expect($(React.findDOMNode(otherApps)).children().length).to.equal(20);
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps');
        }).to.throw();
    });

    // FIXME replace content with tests for account app list
    // it('should allow toggeling the visibility of inactive applications on both, the owned and not owned applications lists', () => {
    //     flux
    //     .getStore('kio')
    //     .receiveApplications([{
    //         id: 'kio',
    //         name: 'Kio',
    //         team_id: 'stups',
    //         active: true
    //     }, {
    //         id: 'yourturn',
    //         name: 'Yourturn',
    //         team_id: 'stups',
    //         active: false
    //     }, {
    //         id: 'foobar',
    //         name: 'FooBar',
    //         team_id: 'foo-team',
    //         active: false
    //     }]);

    //     list = render(List, props);
    //     let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'show-inactive-checkbox'),
    //         teamApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'team-apps'),
    //         otherApps = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'other-apps');

    //     expect($(React.findDOMNode(teamApps)).children().length).to.equal(1); // default: two inactive apps (hidden) one active (shown)

    //     TestUtils.Simulate.change(checkbox); // show inactive apps

    //     expect($(React.findDOMNode(teamApps)).children().length
    //          + $(React.findDOMNode(otherApps)).children().length).to.equal(3);

    // });
});
