import { configureStore } from '@reduxjs/toolkit'
import localhostReducer from './reducer';

export const store = configureStore({
    reducer: {
        lh: localhostReducer,
    },
});