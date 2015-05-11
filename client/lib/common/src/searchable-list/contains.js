export default function(array, value, opts) {
    return array.indexOf(value) >= 0 ? opts.fn(this) : '';
}