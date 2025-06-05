import React, { useEffect } from 'react';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style.css';
import Tilt from 'react-parallax-tilt';
import Testimonials from '../home sections/testimonials';
import { Link } from 'react-router-dom';

const PasswordVault = () => {

    const dataSecurityCards = [
        {
            id: 1,
            icon: '/images/ds1.png', // Replace with the actual icon path
            title: 'Save Time',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            link: '#',
        },
        {
            id: 2,
            icon: '/images/ds2.png', // Replace with the actual icon path
            title: 'Eliminate Errors',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            link: '#',
        },
        {
            id: 3,
            icon: '/images/ds3.png', // Replace with the actual icon path
            title: 'Improve Security',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            link: '#',
        },
        {
            id: 1,
            icon: '/images/ds1.png', // Replace with the actual icon path
            title: 'Password Generator',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            link: '#',
        },
    ];
    const platforms = [
        { name: 'Google Chrome', icon: 'https://www.lastpass.com/-/media/f713d62178144e67bc7a6ce56ec828ef.svg?la=en&hash=D7408BED618D7A7A7574BE7464ED3F71', description: 'Get Password Gladiator Chrome for the most robust feature set of any password manager option.' },
        { name: 'Android', icon: 'https://seeklogo.com/images/A/android-logo-0B5063C0CA-seeklogo.com.png', description: 'Access your personal data on the go with Password Gladiator for Android.' },
        { name: 'iPhone', icon: 'https://www.lastpass.com/-/media/dfe72332941949108b0d9e467da20da7.svg?la=en&hash=EDE2A66001ABEB06B025A6FCE73B85FF', description: 'Our iOS app now supports in-app PasswordVault for one-touch login.' },
        { name: 'Mac', icon: 'https://www.lastpass.com/-/media/dfe72332941949108b0d9e467da20da7.svg?la=en&hash=EDE2A66001ABEB06B025A6FCE73B85FF', description: 'Edit and manage your vault from your desktop with our Mac App.' },
        { name: 'Windows', icon: 'https://www.lastpass.com/-/media/02fd3c51eb6b4ec58cb7f810ddb26947.svg?la=en&hash=68D3B2259F659C5FDFB8640FD586992F', description: 'Manage your Password Gladiator Vault directly from your Windows computer.' },
        { name: 'Mozilla Firefox', icon: 'https://www.lastpass.com/-/media/0bca9bcaa7d1442f86f94a16e7525ecd.svg?la=en&hash=B9B9A4B8A9A0A787B5774AB5141FC812', description: 'PasswordVault forms and log in just one-click with our Firefox extension.' },
        { name: 'Apple Safari', icon: 'https://www.lastpass.com/-/media/056f1882687642eaaf818513969ff592.svg?la=en&hash=651AEE0B279281DCD5B0E5EA857F4145', description: 'Save keystrokes and stay secure online with our Safari password manager.' },
        { name: 'Microsoft Edge', icon: 'https://www.lastpass.com/-/media/3779614c8f824752a176d758bd83a711.svg?la=en&hash=F53FF0347FD9EF7AA21A6A3D0D3E2834', description: 'Save and PasswordVault passwords with our Microsoft Edge extension.' },
        { name: 'Opera Browser', icon: 'https://www.lastpass.com/-/media/a19e66a8dd2942ea8397c43ca26c7d3f.svg?la=en&hash=745A508049A55116A27776356C9B2FA7', description: 'Save and PasswordVault passwords with our Microsoft Edge extension.' },
        { name: 'And many more', icon: '/images/helmet 1.png', description: '' },

    ];

    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <>
            <header className="relative h-[85vh] flex items-center justify-center text-center text-white font-bold rounded-lg" style={{ marginTop: '' }}>
                <div className="absolute inset-0 z-0">
                    <Slider {...settings}>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/images/headimg.png')`, height: '85vh' }}>
                                <img src="/images/headimg.png" alt="Slide 1" style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/top-view-lock-with-password-keyboard_23-2148578100.jpg?ga=GA1.1.2130599266.1720621397&semt=ais_user')`, height: '85vh' }}>
                                <img src="/images/headimg3.png" alt="Slide 2" style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/key-lock-password-security-privacy-protection-graphic_53876-122570.jpg?ga=GA1.1.2130599266.1720621397&semt=ais_user')`, height: '85vh' }}>
                                <img src="/images/headimg2.png" alt="Slide 3" style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/man-using-virtual-screen-enter-unlock-code-mobile-device-innovation-security-privacy-digital-technology-safety-online-internet-financial-banking-networking-concept_55997-5821.jpg?ga=GA1.1.2130599266.1720621397&semt=ais_user')`, height: '85vh' }}>
                                <img src="/images/headimg2.png" alt="Slide 3" style={{ display: 'none' }} />
                            </div>
                        </div>
                    </Slider>
                </div>

                <div className="absolute inset-0 z-10 bg-black bg-opacity-50 pointer-events-none"></div>
                <div className="relative z-20 w-full px-4 py-8">
                    <h1 className="text-5xl md:text-7xl mb-6">Password Vault</h1>
                    <p className="text-xl md:text-3xl mb-4">Intelligent, Safe, Efficient</p>
                    <p className="text-lg md:text-xl text-blue-200 mb-6">Password Vault simplifies and speeds up form completion, enhancing user convenience and reducing errors</p>
                    <div className="space-x-4">
                        <Link to='/plans' className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Personal Plan</Link>
                        <Link to='/plans' className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Team Plan</Link>
                    </div>
                </div>
            </header>

            {/* benefits of PasswordVault (cards) */}
            <section className="py-20 bg-gray-50 font">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-semibold mb-4">Simplify your online life with save and PasswordVault</h2>
                    <div className="flex flex-wrap justify-center">
                        {dataSecurityCards.map((card, index) => (
                            <Tilt key={card.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                                <div
                                    className="bg-white rounded-full shadow-2xl p-8"
                                    data-aos="fade-up"
                                    data-aos-delay={(index + 1) * 200}
                                >
                                    <div className="mb-6">
                                        <img src={card.icon} alt={card.title} className="mx-auto h-16" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                                    <p className="text-gray-600 mb-4">{card.description}</p>
                                    <a href={card.link} className="text-blue-600 hover:text-blue-800">
                                        Learn More →
                                    </a>
                                </div>
                            </Tilt>
                        ))}
                    </div>
                </div>
            </section>


            {/* PasswordVault detail section */}
            <div className="flex justify-center font">
                <div className="flex flex-col md:flex-row w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">

                    {/* Block 2: Image */}
                    {/* <div className="md:w-1/2 flex justify-center items-center">
                    <img src="https://img.freepik.com/premium-vector/digital-illustration-man-demonstrating-online-authentication-large-tablet-display_941526-2633.jpg?w=740" alt="PasswordVault Detail" className="w-full h-full z-2 object-cover" />
                    </div> */}
                    <div className="md:w-1/2 flex justify-center items-center">
                        <video
                            src="https://cdn.pixabay.com/video/2016/02/16/2181-155747485_tiny.mp4"
                            autoPlay
                            muted
                            loop
                            alt="PasswordVault Detail"
                            className="w-full h-full z-2 object-cover" />
                    </div>


                    {/* Block 1: Text Content */}
                    <div className="relative md:w-1/2 px-24 py-32 text-blue-600 flex flex-col justify-center">
                        <h1
                            className="text-5xl font-normal mb-4"
                            data-aos="fade-up"
                        >
                            What is Password<br /> Vault?
                        </h1>
                        <p
                            className="mb-4"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p
                            className="mb-4 text-black border-l-4 border-blue-300 pl-4 mt-4"
                            data-aos="fade-up"
                            data-aos-delay="400"
                        >
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <button
                            className="w-48 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white mt-4"
                            data-aos="fade-left"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>


            {/* cross plateform */}
            <div className=" mt-6 bg-gray-100 p-6 py-10 font" data-aos="fade-up">
                <h1 className="text-center text-4xl font-bold mb-8">Cross-platform Password Management</h1>
                <p className="text-center text-xl text-blue-800 mb-12">Download and use Password Gladiator across any combination of supported browsers and devices.</p>
                <div className="flex flex-wrap justify-center gap-8">
                    {platforms.map((platform, index) => (
                        <div key={index} className="flex flex-col items-center text-center w-64">
                            <img src={platform.icon} alt={platform.name} className="w-16 h-16 mb-4" />
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">{platform.name}</h3>
                            <p className="text-sm">{platform.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* testimonials section */}
            <div className=''>
                <Testimonials />
            </div>
        </>
    );
}

export default PasswordVault;
