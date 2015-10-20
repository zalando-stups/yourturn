1. Write own connectToStores function. Takes strings, returns a function that maps state approriately
    https://github.com/rackt/redux/blob/master/examples/todomvc/containers/App.js#L25
2. Leaf components just receive stores and actions (but not further divided than "module", e.g. kio, fullstop...)
3. Route Handlers are the smart components. They export connected components that know how to traverse state (via connectToStores) and to bind actions (via bindActions, analogue to store connect function).
4. Route Handlers pass stores and actions to child components as needed.


# Step 1

* Leaf components expect their actions and stores via props.
* Route Handlers pass flummox stores and actions down. (Update to React 0.14 first bc of context).

# Step 2

* Update Route Handlers to Redux.
* Maybe figure out a way to run Flummox and Redux simultaneously. Otherwise just drop Flummox at this point.