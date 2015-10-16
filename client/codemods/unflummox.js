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

    // this.store = props.flux.getStore('user') => this.store = props.userStore
    // this.stores = { 'user' : props.flux.getStore('user') } => this.stores = { 'user': props.userStore }
    result
    .find(j.Expression)
    .forEach(expr => {
        let {value} = expr;
        // if we encounter props.flux.getStore(x)
        // => constructor ? props.xStore : this.props.xStore

        if (value.type === 'AssignmentExpression' &&
            value.left.type === 'MemberExpression' && 
            value.left.object.type === 'ThisExpression' &&
            /stores?/.test(value.left.property.name)) {

            // we're accessing this.stores or this.store
            
            if (value.right.type === 'ObjectExpression') {
                // object on the right
                let obj = value.right;
                obj.properties.forEach(prop => {
                    // accessing props.flux.getStore
                    if (prop.value.type === 'CallExpression' &&
                        prop.value.callee.type === 'MemberExpression' &&
                        prop.value.callee.object.object.name === 'props' && 
                        prop.value.callee.object.property.name === 'flux' &&
                        prop.value.callee.property.name === 'getStore') {
                        
                        let name = prop.value.arguments[0].value + 'Store';
                        prop.value = j.memberExpression(j.identifier('props'), j.identifier(name));
                    }
                })
            } else if (value.right.type === 'CallExpression' &&
                value.right.callee.type === 'MemberExpression' &&
                value.right.callee.object.object.name === 'props' && 
                value.right.callee.object.property.name === 'flux' &&
                value.right.callee.property.name === 'getStore') {
                // call on right side
                let name = value.right.arguments[0].value + 'Store';
                value.right = j.memberExpression(j.identifier('props'), j.identifier(name));
            }


        }
    });

    // if we encounter this.stores.x.getSomething(y)
    // => add xGetters to imports
    // => xGetters.getSometing(this.props.xStore, y)

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
