import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
