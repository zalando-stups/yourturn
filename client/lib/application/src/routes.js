/**
 * Names routes are gone, but we don't want strings everywhere.
 */

function appList() {
    return '/application';
}

function appCreate() {
    return '/application/create';
}

function appEdit({applicationId}) {
    return `/application/edit/${applicationId}`;
}

function appOAuth({applicationId}) {
    return `/application/oauth/${applicationId}`;
}

function appAccess({applicationId}) {
    return `/application/access-control/${applicationId}`;
}

function appDetail({applicationId}) {
    return `/application/detail/${applicationId}`;
}

function verList({applicationId}) {
    return `/application/detail/${applicationId}/version`;
}

function verCreate({applicationId}) {
    return `/application/detail/${applicationId}/version/create`;
}

function verApproval({applicationId, versionId}) {
    return `/application/detail/${applicationId}/version/approve/${versionId}`;
}

function verDetail({applicationId, versionId}) {
    return `/application/detail/${applicationId}/version/detail/${versionId}`;
}

function verEdit({applicationId, versionId}) {
    return `/application/detail/${applicationId}/version/edit/${versionId}`;
}

function lifecycle({applicationId}) {
    return `/application/detail/${applicationId}/lifecycle`;
}

export {
    appList,
    appCreate,
    appEdit,
    appOAuth,
    appAccess,
    appDetail,
    verList,
    verCreate,
    verApproval,
    verDetail,
    verEdit,
    lifecycle
};
