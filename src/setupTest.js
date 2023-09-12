import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import path from 'path';
import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { configure as configureLogging } from '@edx/frontend-platform/logging';
import { configure as configureAuth, getAuthenticatedHttpClient, MockAuthService } from '@edx/frontend-platform/auth';
import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import AppProvider from '@edx/frontend-platform/react/AppProvider';
import {
  coursewareReducer,
  modelsReducer,
  fetchCourse,
  fetchSequence,
  appendBrowserTimezoneToUrl,
  executeThunk,
} from '@edx/frontend-app-learning';
import {
  sequenceMetadataFactory,
  learningSequencesOutlineFactory,
  // eslint-disable-next-line import/no-unresolved
} from '@edx/frontend-app-learning/tests';

import { readFileSync } from 'fs';
import appMessages from './i18n';

import { reducer as courseViewReducer } from './features/course-view/data';

const buildSimpleCourseAndSequenceMetadata = sequenceMetadataFactory.default;
const { buildOutlineFromBlocks } = learningSequencesOutlineFactory;

jest.mock('@edx/frontend-platform/analytics');

class MockLoggingService {
  // eslint-disable-next-line no-console
  logInfo = jest.fn(infoString => console.log(infoString));

  // eslint-disable-next-line no-console
  logError = jest.fn(errorString => console.log(errorString));
}

// Mock Intersection Observer which is unavailable in the context of a test.
global.IntersectionObserver = jest.fn(function mockIntersectionObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
});

export const authenticatedUser = {
  userId: 'abc123',
  username: 'MockUser',
  roles: [],
  administrator: false,
};

export function initializeMockApp() {
  mergeConfig({
    CONTACT_URL: process.env.CONTACT_URL || null,
    DISCUSSIONS_MFE_BASE_URL: process.env.DISCUSSIONS_MFE_BASE_URL || null,
    INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
    STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
    TWITTER_URL: process.env.TWITTER_URL || null,
    authenticatedUser: {
      userId: 'abc123',
      username: 'MockUser',
      roles: [],
      administrator: false,
    },
    SUPPORT_URL_ID_VERIFICATION: 'http://example.com',
  });

  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });
  const authService = configureAuth(MockAuthService, {
    config: getConfig(),
    loggingService,
  });

  // i18n doesn't have a service class to return.
  configureI18n({
    config: getConfig(),
    loggingService,
    messages: appMessages,
  });

  return { loggingService, authService };
}

window.scrollTo = jest.fn();

// MessageEvent used for indicating that a unit has been loaded.
export const messageEvent = {
  type: 'plugin.resize',
  payload: {
    height: 300,
  },
};

// Send MessageEvent indicating that a unit has been loaded.
export function loadUnit(message = messageEvent) {
  window.postMessage(message, '*');
}

// Helper function to log unhandled API requests to the console while running tests.
export function logUnhandledRequests(axiosMock) {
  axiosMock.onAny().reply((config) => {
    // eslint-disable-next-line no-console
    console.log(config.method, config.url);
    return [200, {}];
  });
}

let globalStore;

export async function initializeTestStore(options = {}, overrideStore = true) {
  const store = configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseView: courseViewReducer,
    },
  });
  if (overrideStore) {
    globalStore = store;
  }
  initializeMockApp();
  const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  axiosMock.reset();

  const {
    courseBlocks, sequenceBlocks, courseMetadata, sequenceMetadata, courseHomeMetadata,
  } = buildSimpleCourseAndSequenceMetadata(options);

  let courseMetadataUrl = `${getConfig().LMS_BASE_URL}/api/courseware/course/${courseMetadata.id}`;
  courseMetadataUrl = appendBrowserTimezoneToUrl(courseMetadataUrl);

  const learningSequencesUrlRegExp = new RegExp(`${getConfig().LMS_BASE_URL}/api/learning_sequences/v1/course_outline/*`);
  let courseHomeMetadataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseMetadata.id}`;
  const discussionConfigUrl = new RegExp(`${getConfig().LMS_BASE_URL}/api/discussion/v1/courses/*`);
  courseHomeMetadataUrl = appendBrowserTimezoneToUrl(courseHomeMetadataUrl);

  axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);
  axiosMock.onGet(courseHomeMetadataUrl).reply(200, courseHomeMetadata);
  axiosMock.onGet(learningSequencesUrlRegExp).reply(200, buildOutlineFromBlocks(courseBlocks));
  axiosMock.onGet(discussionConfigUrl).reply(200, { provider: 'legacy' });
  sequenceMetadata.forEach(metadata => {
    const sequenceMetadataUrl = `${getConfig().LMS_BASE_URL}/api/courseware/sequence/${metadata.item_id}`;
    axiosMock.onGet(sequenceMetadataUrl).reply(200, metadata);
    const proctoredExamApiUrl = `${getConfig().LMS_BASE_URL}/api/edx_proctoring/v1/proctored_exam/attempt/course_id/${courseMetadata.id}/content_id/${sequenceMetadata.item_id}?is_learning_mfe=true`;
    axiosMock.onGet(proctoredExamApiUrl).reply(200, { exam: {}, active_attempt: {} });
  });

  logUnhandledRequests(axiosMock);

  // eslint-disable-next-line no-unused-expressions
  !options.excludeFetchCourse && await executeThunk(fetchCourse(courseMetadata.id), store.dispatch);

  if (!options.excludeFetchSequence) {
    await Promise.all(sequenceBlocks
      .map(block => executeThunk(fetchSequence(block.id), store.dispatch)));
  }

  return store;
}

function render(
  ui,
  {
    store = null,
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => (
    // eslint-disable-next-line react/jsx-filename-extension
    <IntlProvider locale="en">
      <AppProvider store={store || globalStore}>
        {children}
      </AppProvider>
    </IntlProvider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Appends compiled css styles to the Jest DOM
export function appendStyles(container) {
  const style = document.createElement('style');
  const css = readFileSync(path.join(process.cwd(), 'dist/styles.css'));
  style.innerHTML = css.toString();
  container.append(style);
}

// Re-export everything.
export * from '@testing-library/react';

// Override `render` method.
export {
  render,
};
