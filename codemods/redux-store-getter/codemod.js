function camelCase(word) {
    return word[0].toUpperCase() + word.substring(1);
}

module.exports = function(file, api) {
    if (!/.jsx$/.test(file.path)) {
        // ignore non-jsx
        return;
    }

    let j = api.jscodeshift,
            result = j(file.source);
    console.log(file.path);
    if (/router/.test(file.path)) {
        return;
    }

    // this.stores.x.getSomething(y) => xGetters.getSometing(this.stores.x, y)
    var getterImports = {};
    result
        .find(j.CallExpression)
        .find(j.MemberExpression, { object: { type: 'ThisExpression' }})
        .filter(member => /stores?/.test(member.value.property.name))
        .closest(j.CallExpression)
        .replaceWith(call => {
            console.log(call.value);
            var method = call.value.callee.property.name,
                store = call.value.callee.object.property.name,
                args = call.value.arguments;
            getterImports[store] = true;
            return j.callExpression(
                    j.memberExpression(j.identifier(store + 'Getters'), j.identifier(method)),
                    [j.memberExpression(
                        j.memberExpression(j.thisExpression(), j.identifier('stores')),
                        j.identifier(store))]
                    .concat(args));
        });
    // => add xGetters to imports
    Object
    .keys(getterImports)
    .forEach(getter => {
        let declaration = j.importDeclaration(
                [j.importNamespaceSpecifier(j.identifier(getter + 'Getter'))],
                j.literal('common/src/data/' + getter + '/' + getter + '-getter'));
        result
        .find(j.ClassDeclaration)
        .insertBefore(declaration);
    });

    return result.toSource();
};
