import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
  mergeConfig, getConfig, ensureConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage, PageRoute } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import messages from './i18n';
import './index.scss';
import initializeStore from './app/store';
import CourseView from './features/course-view/CourseView';
import Layout from './features/layout/Layout';
import Pendo from './features/pendo/Pendo';
import CourseAccessErrorPage from './features/course-access-error-page/CourseAccessErrorPage';

ensureConfig([
  'DISABLE_APP_HEADER',
  'ENABLE_PENDO',
], 'CoursePlayer component');

subscribe(APP_READY, () => {
  const enablePendo = getConfig().ENABLE_PENDO;
  ReactDOM.render(
    <AppProvider store={initializeStore()}>
      <Helmet>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
        { enablePendo && <script src={getConfig().PENDO_SNIPPET} type="text/javascript" async />}
      </Helmet>
      { enablePendo && <Pendo />}
      <Layout>
        <Switch>
          <PageRoute path="/course/:courseId/access-denied" component={CourseAccessErrorPage} />
          <PageRoute
            path={[
              '/course/:courseId/:sequenceId/:unitId',
              '/course/:courseId/:sequenceId',
              '/course/:courseId',
            ]}
            component={CourseView}
          />
        </Switch>
      </Layout>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage message={error.message} />,
    document.getElementById('root'),
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        ADA_URL: process.env.ADA_URL || null,
        CONTACT_URL: process.env.CONTACT_URL || null,
        COPYRIGHT_STRING: process.env.COPYRIGHT_STRING || null,
        CREDENTIALS_BASE_URL: process.env.CREDENTIALS_BASE_URL || null,
        CREDIT_HELP_LINK_URL: process.env.CREDIT_HELP_LINK_URL || null,
        CUSTOM_PENDO: process.env.CUSTOM_PENDO === 'true' || null,
        DISCUSSIONS_MFE_BASE_URL: process.env.DISCUSSIONS_MFE_BASE_URL || null,
        ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME || null,
        ENABLE_JUMPNAV: process.env.ENABLE_JUMPNAV || null,
        ENABLE_NOTICES: process.env.ENABLE_NOTICES || null,
        ENABLE_PENDO: process.env.ENABLE_PENDO === 'true' || null,
        INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
        PENDO_SNIPPET: process.env.PENDO_SNIPPET || null,
        PENDO_VISITOR_KEY: process.env.PENDO_VISITOR_KEY || null,
        PENDO_VISITOR_IIFE: process.env.PENDO_VISITOR_IIFE || undefined,
        PENDO_VISITOR_TYPE: process.env.PENDO_VISITOR_TYPE || null,
        PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL || null,
        SEARCH_CATALOG_URL: process.env.SEARCH_CATALOG_URL || null,
        SITE_OPERATOR: process.env.SITE_OPERATOR || '',
        SOCIAL_UTM_MILESTONE_CAMPAIGN: process.env.SOCIAL_UTM_MILESTONE_CAMPAIGN || null,
        STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
        SUPPORT_URL: process.env.SUPPORT_URL || null,
        SUPPORT_URL_CALCULATOR_MATH: process.env.SUPPORT_URL_CALCULATOR_MATH || null,
        SUPPORT_URL_ID_VERIFICATION: process.env.SUPPORT_URL_ID_VERIFICATION || null,
        SUPPORT_URL_VERIFIED_CERTIFICATE: process.env.SUPPORT_URL_VERIFIED_CERTIFICATE || null,
        TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL || null,
        TWITTER_HASHTAG: process.env.TWITTER_HASHTAG || null,
        TWITTER_URL: process.env.TWITTER_URL || null,
        LEGACY_THEME_NAME: process.env.LEGACY_THEME_NAME || null,
        DISABLE_APP_HEADER: process.env.DISABLE_APP_HEADER === 'true' || null,
        DISABLE_APP_FOOTER: process.env.DISABLE_APP_FOOTER === 'true' || null,
        ACCESS_DENIED_PAGE_INSTRUCTIONS_LINK: process.env.ACCESS_DENIED_PAGE_INSTRUCTIONS_LINK || '',
        ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK: process.env.ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK || '',
        ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK_TEXT: process.env.ACCESS_DENIED_PAGE_STUDENT_PORTAL_LINK_TEXT || 'Student Portal',
      }, 'LearnerAppConfig');
    },
  },
  messages,
});
