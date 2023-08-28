import { configureStore } from '@reduxjs/toolkit';
import {
  courseHomeReducer, coursewareReducer, recommendationsReducer, toursReducer, modelsReducer,
} from '@edx/frontend-app-learning';
import { reducer as courseViewReducer } from '../features/course-view/data';

export default function initializeStore() {
  return configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseHome: courseHomeReducer,
      recommendations: recommendationsReducer,
      tours: toursReducer,
      courseView: courseViewReducer,
    },
  });
}
