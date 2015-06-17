// extracts team, artifact name and version of something like
// docker://docker.io/stups/yourturn:1.0-squirrel
//   team => stups
//   artifact name => yourturn
//   tag => 1.0-squirrel
const ARTIFACT_REGEX = /([A-Za-z\-]+)\/([A-Za-z\-]+):([A-Za-z0-9\._\-]+)/;

function parseArtifact(artifact) {
    if (!artifact) {
        return false;
    }
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

export {
    parseArtifact as parseArtifact
};