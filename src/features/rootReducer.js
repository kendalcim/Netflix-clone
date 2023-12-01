import { combineReducers } from 'redux';
import userReducer from './userSlice';// Adjust the path accordingly

const rootReducer = combineReducers({
    user: userReducer,
    // Add other reducers here if needed
});

export default rootReducer;