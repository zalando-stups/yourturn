function resList() {
    return '/resource';
}

function resCreate() {
    return '/resource/create';
}

function resEdit({resourceId}) {
    return `/resource/edit/${resourceId}`;
}

function resDetail({resourceId}) {
    return `/resource/detail/${resourceId}`;
}

function scpCreate({resourceId}) {
    return `/resource/detail/${resourceId}/scope/create`;
}

function scpDetail({resourceId, scopeId}) {
    return `/resource/detail/${resourceId}/scope/detail/${scopeId}`;
}

function scpEdit({resourceId, scopeId}) {
    return `/resource/detail/${resourceId}/scope/edit/${scopeId}`;
}

export {
    resList,
    resCreate,
    resEdit,
    resDetail,
    scpCreate,
    scpDetail,
    scpEdit
};
