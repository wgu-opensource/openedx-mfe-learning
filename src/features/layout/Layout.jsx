import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

const Layout = ({children}) => {
    return <div>
        <Header />
        {children}
        <Footer />
    </div>
}

export default Layout