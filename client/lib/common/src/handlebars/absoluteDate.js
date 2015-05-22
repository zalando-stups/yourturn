import moment from 'moment';
import {DATE_FORMAT} from 'common/src/config';

export default function (value, opts) {
    if (!value) {
        return `<span>unknown</span>`;
    }
    let date = moment(value),
        absoluteDate = date.format(DATE_FORMAT);
    return `<span>${absoluteDate}</span>`;
}