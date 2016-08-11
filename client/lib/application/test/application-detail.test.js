/* global expect, $, TestUtils, reset, render, React */
import Detail from 'application/src/application-detail/application-detail.jsx';
import {Pending} from 'common/src/fetch-result';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
describe('The application detail view', () => {
    var TEST_APP,
        props,
        detail;

    beforeEach(() => {
        reset();

        TEST_APP = {
            documentation_url: 'https://github.com/zalando-stups/kio',
            scm_url: 'https://github.com/zalando-stups/kio.git',
            service_url: 'https://kio.example.org/',
            description: '# Kio',
            subtitle: 'STUPS application registry',
            name: 'Kio',
            active: true,
            team_id: 'stups',
            id: 'kio',
            publicly_accessible: true
        };

        props = {
            applicationId: TEST_APP.id,
            application: TEST_APP,
            editable: true,
            api: {},
            versions: [],
            notificationActions: {},
            kioActions: {}
        };
        detail = render(Detail, props);
    });

    it('should display a placeholder when the application is Pending', () => {
        props.application = new Pending();

        detail = render(Detail, props);
        let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(detail, 'u-placeholder');
        expect(placeholders.length).to.equal(1);
    });

    it('should not a display a placeholder when the api is Pending', () => {
        props.api = new Pending();
        detail = render(Detail, props);
        let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(detail, 'u-placeholder');
        expect(placeholders.length).to.equal(0);
    });

    it('should display an inactive badge when the application is inactive', () => {
        props.application = Object.assign({}, TEST_APP, { active: false });

        detail = render(Detail, props);
        let inactiveBadges = TestUtils.scryRenderedDOMComponentsWithAttributeValue(detail, 'data-block', 'inactive-badge');
        expect(inactiveBadges.length).to.equal(1);
    });

    it('should not display a badge when the application is active', () => {
        detail = render(Detail, props);
        let inactiveBadges = TestUtils.scryRenderedDOMComponentsWithAttributeValue(detail, 'data-block', 'inactive-badge');
        expect(inactiveBadges.length).to.equal(0);
    });

    it('should contain rendered markdown', () => {
        detail = render(Detail, props);
        expect($(React.findDOMNode(detail)).find('[data-block="description"] h1').length).to.equal(1);
    });

    it('should display a "is public" badge', () => {
        detail = render(Detail, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'public-badge');
    });
});
/*eslint-enable react/no-deprecated */

