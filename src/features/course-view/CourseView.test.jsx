import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { breakpoints } from '@edx/paragon';
import { appendBrowserTimezoneToUrl } from '@edx/frontend-app-learning';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  render, screen, waitFor, initializeTestStore, buildSimpleCourseAndSequenceMetadata,
} from '../../setupTest';
import CourseView from './CourseView';

describe('CourseView', () => {
  let mockData;
  let store;

  beforeAll(async () => {
    store = await initializeTestStore();
    const { courseware } = store.getState();
    mockData = {
      match: {
        params: {
          courseId: courseware.courseId,
          sequenceId: courseware.sequenceId,
          unitId: 'test',
        },
      },
    };
  });

  beforeEach(() => {
    global.innerWidth = breakpoints.extraLarge.minWidth;
  });

  it('renders', async () => {
    render(<CourseView {...mockData} />);
    await waitFor(() => expect(screen.queryByText('Loading learning sequence...')).toBeInTheDocument());
  });

  it('redirects to access denied page when user is not authorized', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    let courseHomeMetadataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${mockData.match.params.courseId}`;
    courseHomeMetadataUrl = appendBrowserTimezoneToUrl(courseHomeMetadataUrl);

    let courseMetadataUrl = `${getConfig().LMS_BASE_URL}/api/courseware/course/${mockData.match.params.courseId}`;
    courseMetadataUrl = appendBrowserTimezoneToUrl(courseMetadataUrl);

    const {
      courseMetadata, courseHomeMetadata,
    } = buildSimpleCourseAndSequenceMetadata();

    courseHomeMetadata.course_access.has_access = false;

    courseMetadata.access_expiration = null;
    courseMetadata.enrollment = {
      mode: null,
      is_active: false,
    };

    axiosMock.onGet(courseHomeMetadataUrl).reply(200, courseHomeMetadata);
    axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);

    render(<CourseView {...mockData} />);

    await waitFor(() => expect(global.location.href).toEqual(`http://localhost/course/${mockData.match.params.courseId}/access-denied`));
  });
});
