import moment from 'moment';

export default function (value, opts) {
    let date = moment(value),
        absoluteDate = date.format('MMMM Do YYYY, h:mm:ss a'),
        relativeDate = date.fromNow();
    return `<span title="${absoluteDate}">${relativeDate}</span>`;
}