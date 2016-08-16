/* globals expect, $, TestUtils, reset, render, React */
import Detail from 'application/src/version-detail/version-detail.jsx';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
const TEAM = 'stups',
    VER = '0.1',
    APP = 'kio',
    TEST_APP = {
        id: APP,
        name: 'Kio'
    },
    TEST_VERSION = {
        id: VER,
        application_id: APP,
        artifact: `docker://docker.io/${TEAM}/${APP}:${VER}`,
        notes: '# Test'
    },
    TEST_SOURCE = {
        author: 'npiccolotto',
        status: 'M index.html'
    };

describe('The version detail view', () => {
    var props,
        detail;

    beforeEach(() => {
        reset();
        props = {
            applicationId: APP,
            versionId: VER,
            scmSource: TEST_SOURCE,
            artifactInfo: {
                team: TEAM,
                artifact: APP,
                tag: VER
            },
            tags: [],
            editable: true,
            approvalCount: 2,
            version: TEST_VERSION,
            application: TEST_APP
        };
        detail = render(Detail, props);
    });

    it('should show rendered markdown', () => {
        let notes = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'version-notes');
        expect($(React.findDOMNode(notes)).find('h1').length).to.equal(1);
    });

    it('should display a warning about modified scm-source', () => {
        detail = render(Detail, props);
        // will throw if not there
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'locally-modified-warning');
    });

    it('should display a warning about missing scm-source', () => {
        detail = render(Detail, {...props, scmSource: null, tags: [VER]});
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'missing-scmsource-warning');
    });
});
/*eslint-enable react/no-deprecated */
