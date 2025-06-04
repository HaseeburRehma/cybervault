import React, { useState } from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'animate.css';
import { FaCheck } from 'react-icons/fa';
import Slider from 'react-slick';
import ProductDetail from "./home sections/productdetail";
import PlanCards from "./home sections/plancards";
import FAQ from "./home sections/faq";

const Plans = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animation, setAnimation] = useState('animate__fadeIn');

    const slides = [
        {
            video: "https://videos.pexels.com/video-files/3045163/3045163-sd_640_360_25fps.mp4",
            heading: "For Personal",
            description: "Secure, Reliable, User-Friendly",
            subDescription: "Our password manager ensures your personal passwords are stored safely and are easily accessible.",
        },
        {
            video: "https://videos.pexels.com/video-files/2611250/2611250-sd_640_360_30fps.mp4",
            heading: "For Team",
            description: "Collaborative, Coordinated, Secure",
            subDescription: "Enhance team productivity with secure password sharing and management for all team members.",
        },
        {
            video: "https://videos.pexels.com/video-files/3141207/3141207-sd_640_360_25fps.mp4",
            heading: "Free Trial",
            description: "Explore, Experience, Secure",
            subDescription: "Try our password manager for free and discover its benefits before making a decision.",
        }
    ];

    const planData = {
        headers: ['', 'Free', 'Premium', 'Families'],
        rows: [
            { label: 'Price', values: ['Free', '$3.00 / month', '$4.00 / month'] },
            { label: 'User limit', values: ['1 User', '1 User', '6 Users'] },
            { label: 'Number of passwords', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
            { label: 'Device type', values: ['Limited to 1', 'Unlimited', 'Unlimited'] },
            //   { label: 'Automatic device sync', values: [true, true, true] },
            { label: 'Price', values: ['Free', '$3.00 / month', '$4.00 / month'] },
            { label: 'User limit', values: ['1 User', '1 User', '6 Users'] },
            { label: 'Number of passwords', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
            { label: 'Device type', values: ['Limited to 1', 'Unlimited', 'Unlimited'] },
            { label: 'Price', values: ['Free', '$3.00 / month', '$4.00 / month'] },
            { label: 'User limit', values: ['1 User', '1 User', '6 Users'] },
            { label: 'Number of passwords', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
            { label: 'Device type', values: ['Limited to 1', 'Unlimited', 'Unlimited'] },
        ]
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: (oldIndex, newIndex) => {
            setAnimation('animate__fadeOut');
            setTimeout(() => {
                setCurrentSlide(newIndex);
                setAnimation('animate__fadeIn');
            }, 500); // Match the animation duration
        },
    };

    return (
        <>
            {/* head slider and content */}
            <header className="relative h-[85vh] flex items-center justify-center text-center text-white font-bold rounded-lg">
                <div className="absolute inset-0 z-0">
                    <Slider {...settings}>
                        {slides.map((slide, index) => (
                            <div key={index}>
                                <div className="bg-cover bg-center" style={{ height: '85vh' }}>
                                    <video src={slide.video} autoPlay loop muted className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="absolute inset-0 z-10 bg-black bg-opacity-50 pointer-events-none"></div>
                <div className={`relative z-20 w-full px-4 py-8 animate__animated ${animation}`}>
                    <h1 className="text-5xl md:text-7xl mb-6">{slides[currentSlide].heading}</h1>
                    <p className="text-xl md:text-3xl mb-4">{slides[currentSlide].description}</p>
                    <p className="text-lg md:text-xl text-blue-200 mb-6">{slides[currentSlide].subDescription}</p>
                    <div className="space-x-4">
                        <a href="#personal-plan" className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Personal Plan</a>
                        <a href="#personal-plan" className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Team Plan</a>
                    </div>
                </div>
            </header>

            <ProductDetail />

            <div id="personal-plan">
                <PlanCards />
            </div>

            {/* table */}
            <div className="overflow-x-auto p-6 font">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {planData.headers.map((header, index) => (
                                <th key={index} className="py-3 px-4 bg-blue-400 text-white font-bold text-center">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {planData.rows.map((row, rowIndex) => (
                            row.isSectionHeader ? (
                                <tr key={rowIndex} className="bg-gray-100">
                                    <td colSpan={planData.headers.length} className="py-3 px-4 text-center font-bold text-gray-700">
                                        {row.label}
                                    </td>
                                </tr>
                            ) : (
                                <tr key={rowIndex}>
                                    <td className="py-3 px-4 text-lg font-bold border-b">{row.label}</td>
                                    {row.values.map((value, valueIndex) => (
                                        <td key={valueIndex} className="py-3 px-4 border-b justify-center text-center">
                                            {typeof value === 'boolean' ? <FaCheck className="text-green-500" /> : value}
                                        </td>
                                    ))}
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>

            <FAQ />
        </>
    );
}

export default Plans;
