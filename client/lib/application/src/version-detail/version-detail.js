/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './version-detail.hbs';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';
import 'common/asset/scss/application/version-detail.scss';

// extracts team, artifact name and version of something like
// docker://docker.io/stups/yourturn:1.0-squirrel
//   team => stups
//   artifact name => yourturn
//   tag => 1.0-squirrel
const ARTIFACT_REGEX = /([A-Za-z\-]+)\/([A-Za-z\-]+):([A-Za-z0-9\._\-]+)/;

class VersionDetail extends BaseView {
    constructor(props) {
        props.className = 'versionDetail';
        props.stores = {
            kio: props.flux.getStore('kio'),
            pierone: props.flux.getStore('pierone')
        };
        super(props);
        // fetch scm source from pierone
        // we have to do this here because the only
        // way to fetch the correct thing is to
        // parse version.artifact
        this.version = this.stores.kio.getApplicationVersion(props.applicationId, props.versionId);
        this.image = this.parseArtifact(this.version.artifact);

        if (ENV_TEST) {
            return;
        }

        if (this.image) {
            props
            .flux
            .getActions('pierone')
            .fetchTags(this.image.team, this.image.artifact);

            let sauce = this.stores.pierone.getScmSource(this.image.team, this.image.artifact, this.image.tag);
            if (sauce === false) {
                props
                .flux
                .getActions('pierone')
                .fetchScmSource(this.image.team, this.image.artifact, this.image.tag);
            }
        }
    }

    parseArtifact(artifact) {
        // artifact looks like docker://docker.io/team/artifactName:tag
        // we are interested in team, artifact name and tag
        let matches = artifact.match(ARTIFACT_REGEX);
        if (matches && matches.length === 4) {
            return {
                team: matches[1],
                artifact: matches[2],
                tag: matches[3]
            };
        }
        return false;
    }

    update() {
        let {applicationId, versionId} = this.props,
            {image, stores} = this,
            application = stores.kio.getApplication(applicationId),
            approvals = stores.kio.getApprovals(applicationId, versionId),
            registryTags = image ?
                            stores.pierone.getTags(image.team, image.artifact) :
                            [],
            scmSource = image ?
                            stores.pierone.getScmSource(image.team, image.artifact, image.tag) :
                            false;
        this.data = {
            applicationId: applicationId,
            versionId: versionId,
            version: this.version,
            scmSource: scmSource,
            isTagInRegistry: registryTags
                                .map(t => t.name)
                                .some(n => n === image.tag),
            approvalCount: approvals.length,
            application: application instanceof FetchResult ? false : application
        };
        if (scmSource instanceof FetchResult) {
            if (scmSource.isFailed() && scmSource.getResult().status === 404) {
                this.data.scmSource = false;
            }
        } else if (scmSource) {
            // should not be false by now
            this.data.scmErrors = {
                locallyModified: scmSource.status.length !== 0
            };
        }
    }

    render() {
        let {data, $el} = this;

        if (data.version instanceof FetchResult) {
            $el.html(
                data.version.isPending() ?
                Placeholder(data) :
                ErrorTpl(data.version.getResult())
            );
        } else {
            $el.html(Template(data));
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.version.notes));
        }
        return this;
    }
}

export default VersionDetail;
