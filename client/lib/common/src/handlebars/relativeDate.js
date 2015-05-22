import moment from 'moment';
import {DATE_FORMAT} from 'common/src/config';

export default function (value, opts) {
    if (!value) {
        return `<span>never</span>`;
    }
    let date = moment(value),
        absoluteDate = date.format(DATE_FORMAT),
        relativeDate = date.fromNow();
    return `<span title="${absoluteDate}">${relativeDate}</span>`;
}