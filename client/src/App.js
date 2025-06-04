import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import Footer from './components/footer';
import Plans from './components/plans';
import Autofill from './components/products/autofill';
import PasswordGenerator from './components/products/passwordgenerator';
import PasswordVault from './components/products/passwordvault';
import CredentialForm from './components/Forms/credentialform';
import UserProfile from './components/UserProfile/userProfile';
import Success from './components/successfull';

function App() {
    const location = useLocation();
    const hideNavbarAndFooter = location.pathname === '/userProfile' || location.pathname === '/credentialform';

    return (
        <>
            {!hideNavbarAndFooter && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/autofill" element={<Autofill />} />
                <Route path="/passwordgenerator" element={<PasswordGenerator />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/passwordvault" element={<PasswordVault />} />
                <Route path="/credentialform" element={<CredentialForm />} />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/successfull" element={<Success />} />
            </Routes>
            {!hideNavbarAndFooter && <Footer />}
        </>
    );
}

function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default Root;
