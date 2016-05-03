import qs from 'querystring';

function violation(params) {
    let p = !!params ?
                '?' + qs.stringify(params) :
                '';
    return '/violation' + p;
}
function short({shortened}) {
    return `/violation/v/${shortened}`;
}

function vioDetail({violationId}) {
    return `/violation/${violationId}`;
}

export {
    violation,
    short,
    vioDetail
};
