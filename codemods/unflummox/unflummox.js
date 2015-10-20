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

    if (/router/.test(file.path)) {
        // reflect new component api in route handlers
        result
            .find(j.JSXElement)
            .filter(jsx => jsx.value.openingElement.name.name  === 'FluxComponent')
            .forEach(jsx => {
                var stores = jsx.value.openingElement.attributes
                    .filter(attr => attr.name.name === 'connectToStores')
                    .map(attr => attr.value.expression.elements)
                    .reduce((arr, attr) => arr.concat(attr), [])
                    .map(attr => attr.value);
                var child = jsx.value.children.filter(child => child.type === 'JSXElement')[0];
                stores.forEach(store => {
                    // kioStore={FLUX.getStore('kio')}
                    var attr = j.jsxAttribute(
                                j.jsxIdentifier(store + 'Store'),
                                j.jsxExpressionContainer(
                                    j.callExpression(
                                        j.memberExpression(
                                            j.identifier('FLUX'),
                                            j.identifier('getStore')),
                                        [j.literal(store)]))); 
                    child.openingElement.attributes.push(attr);
                });
            });
        return result.toSource();
    }

    // this.stores = { 'user' : props.flux.getStore('user') } => this.stores = { 'user': props.userStore }
    result
        .find(j.AssignmentExpression)
        .filter(ass => ass.value.left.type === 'MemberExpression'
                && ass.value.left.object.type === 'ThisExpression'
                && ass.value.left.property.name === 'stores')
        .find(j.ObjectExpression)
        .find(j.Property)
        .replaceWith(prop => {
            return j.property(
                    'init',
                    prop.value.key,
                    j.memberExpression(
                        j.identifier('props'),
                        j.identifier(prop.value.key.name + 'Store')));
        });

    // this.stores.x.getSomething(y) => xGetters.getSometing(this.stores.x, y)
    // var getterImports = {};
    // result
    //     .find(j.CallExpression)
    //     .find(j.MemberExpression, { object: { type: 'ThisExpression' }})
    //     .filter(member => /stores?/.test(member.value.property.name))
    //     .closest(j.CallExpression)
    //     .replaceWith(call => {
    //         console.log(call.value);
    //         var method = call.value.callee.property.name,
    //             store = call.value.callee.object.property.name,
    //             args = call.value.arguments;
    //         getterImports[store] = true;
    //         return j.callExpression(
    //                 j.memberExpression(j.identifier(store + 'Getters'), j.identifier(method)),
    //                 [j.memberExpression(
    //                     j.memberExpression(j.thisExpression(), j.identifier('stores')),
    //                     j.identifier(store))]
    //                 .concat(args));
    //     });
    // // => add xGetters to imports
    // Object
    // .keys(getterImports)
    // .forEach(getter => {
    //     let declaration = j.importDeclaration(
    //             [j.importNamespaceSpecifier(j.identifier(getter + 'Getter'))],
    //             j.literal('common/src/data/' + getter + '/' + getter + '-getter'));
    //     result
    //     .find(j.ClassDeclaration)
    //     .insertBefore(declaration);
    // });

    // flux.getActions('user') => this.props.userActions
    result
        .find(j.CallExpression)
        .filter(call => call.value.callee.type === 'MemberExpression')
        .filter(call => call.value.callee.property.name === 'getActions')
        .replaceWith(call => {
            return j.memberExpression(
                    j.memberExpression(
                        j.thisExpression(),
                        j.identifier('props')),
                    j.identifier(call.value.arguments[0].value + 'Actions'));
        });

    return result.toSource();
};
