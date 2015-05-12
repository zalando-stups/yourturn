export default function (array, value, opts) {
    return array ?
            (array.indexOf(value) >= 0 ? opts.fn(this) : '') :
            '';
}