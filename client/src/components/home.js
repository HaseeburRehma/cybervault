import React from "react";
import Header from "./home sections/header";
import DataSecurityCards from "./home sections/datasecuritycards";
import ProductDetail from "./home sections/productdetail";
import ClientsAndPartners from "./home sections/client";
import Testimonials from "./home sections/testimonials";
import FeaturedPlans from "./home sections/packages";
const Home = () => {
    return (
        <>
            <Header />
            <DataSecurityCards />
            <ProductDetail/>
            <ClientsAndPartners/>
            <Testimonials/>
            <FeaturedPlans/>
        </>
    );
}

export default Home;
