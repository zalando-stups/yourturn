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
    lifecycle
};
