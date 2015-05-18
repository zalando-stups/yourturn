export default function (value, opts) {
    return value < Date.now() ? opts.fn(this) : '';
}