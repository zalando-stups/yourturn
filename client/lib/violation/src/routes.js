function violation() {
    return '/violation';
}
function short({shortened}) {
    return `/violation/v/${shortened}`;
}

function vioDetail({violationId}) {
    return `violation/${violationId}`;
}

export {
    violation,
    short,
    vioDetail,
};
