import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLayoutHasSidebar } from '../course-view/data/slice';

const CourseAccessErrorPage = () => {
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
        <a href="https://example.com/" target="_blank" rel="noreferrer">
          instructions to clear your cookies
        </a>.
      </p>
      <p>
        Then try accessing the course again through the&nbsp;
        <a href="https://example.com/" target="_blank" rel="noreferrer">
          Student Portal
        </a>.
      </p>
    </div>
  );
};

export default CourseAccessErrorPage;
