import {createLogic} from "redux-logic";
import {INIT_APP} from "../../Constants/InitConstants";

export const InitManager = createLogic({
   type: INIT_APP,

   async process({action, getState}, dispatch, done) {
        console.log('action', action, 'getState', getState );
       // Todo make an init action eg.: dispatch(funcExampleDispatched());
       done();
   }
});

export const InitManagers = [
    InitManager
];
