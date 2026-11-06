import { configureStore } from '@reduxjs/toolkit';
import {
  coursewareReducer, modelsReducer, pluginsReducer,
} from '@edx/frontend-app-learning';
import { reducer as specialExamsReducer } from '@edx/frontend-lib-special-exams';
import { reducer as courseViewReducer } from '../features/course-view/data';
import { reducer as sidebarReducer } from '../features/sidebar/data/slice';

export default function initializeStore() {
  return configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseView: courseViewReducer,
      sidebar: sidebarReducer,
      specialExams: specialExamsReducer,
      plugins: pluginsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['plugin/registerOverrideMethod'],
        ignoredPaths: ['plugins'],
      },
    }),
  });
}
