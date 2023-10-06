import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import { setLayoutHasSidebar } from '../course-view/data/slice';

ensureConfig([
  'ACCESS_DENIED_PAGE_INSTRUCTIONS_LINK',
  'ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK',
  'ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK_TEXT',
], 'CoursePlayer component');

const CourseAccessErrorPage = () => {
  const instructionsLink = getConfig().ACCESS_DENIED_PAGE_INSTRUCTIONS_LINK;
  const studentPortalLink = getConfig().ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK;
  const studentPortalText = getConfig().ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK_TEXT;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLayoutHasSidebar(false));
  });

  return (
    <div className="course-access-error-page">
      <p>
        Sorry! You don&apos;t have permission to access this page.
      </p>
      <p>
        It may be due to a browser issue.
        Please follow these&nbsp;
        <a href={instructionsLink} target="_blank" rel="noreferrer">
          instructions to clear your cookies
        </a>.
      </p>
      <p>
        Then try accessing the course again through the&nbsp;
        <a href={studentPortalLink} target="_blank" rel="noreferrer">
          {studentPortalText}
        </a>.
      </p>
    </div>
  );
};

export default CourseAccessErrorPage;
