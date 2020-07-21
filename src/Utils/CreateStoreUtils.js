/* eslint-disable array-callback-return */
import {createHashHistory} from "history";
import {routerMiddleware, connectRouter} from "connected-react-router";
import * as axios from "axios";
import {createLogicMiddleware} from "redux-logic";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";

export const initializeStore = (reducers = [], managers = []) => {

    const history = createHashHistory({hashType: "hashbang"});
    const reducerList = createReducerList(reducers);
    const managerList = createLogicList(managers);

    const {enhancers, routerReducer} = initMiddleware(reducerList, managerList, history);

    const reducerManager = combineReducers(routerReducer);
    const store = createStore(reducerManager, enhancers);

    return {store, history};
};

// Create ReducerList
const createReducerList = (reducers) => {
    let reducerList = [];
    reducers.forEach(reducer => {
        Object.keys(reducer).map((objectKey) => {
            let reducerFunction = reducer[objectKey];
            reducerList[objectKey] = reducerWrapper(reducerFunction);
        })
    });
    return reducerList;
};


// Create LogicList
const createLogicList = (managers) => {

    let managerList = [];
    managers.forEach(manager => {
        managerList.push(manager);
    });
    return managerList
};

// Initialized Middleware
const initMiddleware = (reducerList, managerList, history) => {
    //Add Middleware to store
    const storeMiddleware = routerMiddleware(history);

    //I Can Combine mor enhancer to store like: logic middleware, redux-route, ...
    let enhancers;
    const dependencies = {
        httpClient: axios
    };

    // Apply middleware to Logic
    const logicMiddleware = createLogicMiddleware(managerList, dependencies);
    if (window.__REDUX_DEVTOOLS_EXTENSION__ === undefined) {
        enhancers = compose(
            applyMiddleware(logicMiddleware),
            applyMiddleware(storeMiddleware),
        );
    } else {
        enhancers = compose(
            applyMiddleware(logicMiddleware),
            applyMiddleware(storeMiddleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        );
    }

    const routerReducer = {
        router: connectRouter(history),
        ...reducerList
    };

    return {enhancers, logicMiddleware, routerReducer, dependencies}
};

// Create Wrapper To manage Error from reducers
const reducerWrapper = (reducerFunction) => {
    return function () {
        try {
            return reducerFunction.apply(this, arguments);
        } catch (error) {
            console.log(error);
            return arguments[0];
        }
    }
};
