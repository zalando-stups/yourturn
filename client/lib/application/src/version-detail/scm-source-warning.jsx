import React from 'react';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';

const ScmSourceWarning = (props) => {
    let {scmSource, artifact, artifactInfo, tags} = props,
        locallyModified = <noscript />,
        missingScmSource = <noscript />;

    if (scmSource instanceof FetchResult) {
        return (scmSource.isPending() ?
                <noscript /> :
                <DefaultError error={scmSource.getResult()} />)
    }
    // no scm-source, but tag in pierone -> bad
    if (!scmSource && tags.indexOf(artifactInfo.tag) >= 0) {
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
                                Artifact was locally modified:<br />
                                {scmSource.status}
                            </div>;
    }

    return (<div>
                {locallyModified}
                {missingScmSource}
            </div>)
};

ScmSourceWarning.displayName = 'ScmSourceWarning';

ScmSourceWarning.propTypes = {
    artifact: React.PropTypes.string,
    artifactInfo: React.PropTypes.shape({
        tag: React.PropTypes.string
    }).isRequired,
    scmSource: React.PropTypes.object.isRequired,
    tags: React.PropTypes.array,
    version: React.PropTypes.object.isRequired
};

export default ScmSourceWarning;
