import { configureStore } from "@reduxjs/toolkit";
import projectReducer from '../features/projects/projectSlice';
import taskReducer from '../features/tasks/taskSlice';

export const store = configureStore({

    reducer:{
        project: projectReducer,
        task: taskReducer,
    },
});


export default store;