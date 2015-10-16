function camelCase(word) {
    return word[0].toUpperCase() + word.substring(1);
}

module.exports = function(file, api) {
    if (/^router/.test(file.path)) {
        // do not touch routers here
        return;
    }
    if (/test.js$/.test(file.path)) {
        // also do not touch tests
        return;
    }

    let j = api.jscodeshift,
            result = j(file.source);

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

    // this.action = props.flux.getActions('user') => delete
    result
        .find(j.AssignmentExpression)
        .filter(assignment => assignment.value.right.type === 'CallExpression')
        .find(j.CallExpression)
        .filter(call => call.value.callee.type === 'MemberExpression')
        .filter(call => call.value.callee.property.name === 'getActions')
        .closest(j.AssignmentExpression)
        .remove();
        
    // flux.getActions('blahr').foo() => blahrActionsFoo()
    result
        .find(j.MemberExpression)
        .filter(member => member.value.property.name === 'getActions')
        .closest(j.CallExpression)
        .filter(call => call.parentPath.value.type === 'MemberExpression')
        .map(call => call.parentPath.parentPath)
        .replaceWith(expr => {
            let method = expr.value.callee.property.name,
                args = expr.value.arguments,
                actions = expr.value.callee.object.arguments[0].value;
            return j.callExpression(
                    j.memberExpression(
                      j.memberExpression(j.thisExpression(), j.identifier('props')),
                      j.identifier(actions + 'Actions' + camelCase(method))),
                    args);
        });

    return result.toSource();
};
