import React from 'react';
import {parseArtifact} from 'application/src/util';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';

class ScmSourceWarning extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {scmSource, artifact, artifactInfo, tags} = this.props,
            locallyModified = <noscript />,
            missingScmSource = <noscript />;

        if (scmSource instanceof FetchResult) {
            return scmSource.isPending() ?
                    <noscript /> :
                    <DefaultError error={scmSource.getResult()} />;
        }
        // no scm-source, but tag in pierone -> bad
        if (!scmSource && tags.map(t => t.name).indexOf(artifactInfo.tag) >= 0) {
            missingScmSource = <div
                                    data-block='missing-scmsource-warning'
                                    className='u-warning'>
                                    scm-source.json missing for {artifact}
                                </div>;
        }

        // status not empty string -> locally modified -> bad
        if (scmSource && scmSource.status !== '') {
            locallyModified = <div
                                    data-block='locally-modified-warning'
                                    className='u-warning'>
                                    Artifact was locally modified:<br/>
                                    {scmSource.status}
                                </div>;
        }

        return <div>
                    {locallyModified}
                    {missingScmSource}
                </div>;
    }
}
ScmSourceWarning.displayName = 'ScmSourceWarning';
ScmSourceWarning.propTypes = {
    scmSource: React.PropTypes.object.isRequired,
    version: React.PropTypes.object.isRequired
};

export default ScmSourceWarning;
