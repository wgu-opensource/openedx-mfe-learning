import { configureStore } from '@reduxjs/toolkit';
import {
  coursewareReducer, modelsReducer,
} from '@edx/frontend-app-learning';
import { reducer as courseViewReducer } from '../features/course-view/data';
import { reducer as sidebarReducer } from '../features/sidebar/data/slice';

export default function initializeStore() {
  return configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseView: courseViewReducer,
      sidebar: sidebarReducer,
    },
  });
}
