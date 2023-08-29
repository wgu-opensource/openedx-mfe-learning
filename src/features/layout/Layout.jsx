import Footer from '@edx/frontend-component-footer';
import PropTypes from 'prop-types';
import Header from '../header/Header';

const Layout = ({ children }) => (
  <>
    <Header />
    <div className="layout-body">
      {children}
    </div>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
