import {initializeStore} from "../Utils/CreateStoreUtils";
import reducers from "./Reducers";
import managers from "./Manager";

const {store, history} = initializeStore([reducers], managers);

export {store, history}
