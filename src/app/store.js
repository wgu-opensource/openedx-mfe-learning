import { configureStore } from '@reduxjs/toolkit';
import {courseHomeReducer,coursewareReducer,recommendationsReducer,toursReducer,modelsReducer} from "@edx/frontend-app-learning"


export default function initializeStore() {
  return configureStore({
    reducer: {
        models: modelsReducer,
        courseware: coursewareReducer,
        courseHome: courseHomeReducer,
        recommendations: recommendationsReducer,
        tours: toursReducer,
    },
  });
}