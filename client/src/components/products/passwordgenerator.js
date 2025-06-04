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


const PasswordGenerator = () => {

    const dataSecurityCards = [
        {
            id: 1,
            icon: '/images/ds1.png',
            title: 'Strong Passwords',
            description: 'Generate strong and unique passwords for all your accounts, ensuring maximum security. Use a combination of letters, numbers, and symbols for better protection.',
            link: '#',
        },
        {
            id: 2,
            icon: '/images/ds2.png',
            title: 'Customizable Options',
            description: 'Customize your passwords with different lengths, characters, and complexity settings. Tailor your security needs with ease.and symbols for better protection.',
            link: '#',
        },
        {
            id: 3,
            icon: '/images/ds3.png',
            title: 'Easy to Use',
            description: 'Simple and user-friendly interface to generate passwords with just one click. No more hassle in managing your account access.and symbols for better protection.',
            link: '#',
        },
        {
            id: 4,
            icon: '/images/ds1.png',
            title: 'Secure Storage',
            description: 'Store your generated passwords securely in our password manager. Access them anytime, anywhere with peace of mind.and symbols for better and symbols.',
            link: '#',
        },
    ];

    const platforms = [
        { name: 'Google Chrome', icon: 'https://www.lastpass.com/-/media/f713d62178144e67bc7a6ce56ec828ef.svg?la=en&hash=D7408BED618D7A7A7574BE7464ED3F71', description: 'Generate and save strong passwords directly from Chrome.' },
        { name: 'Android', icon: 'https://seeklogo.com/images/A/android-logo-0B5063C0CA-seeklogo.com.png', description: 'Generate strong passwords on the go with our Android app.' },
        { name: 'iPhone', icon: 'https://www.lastpass.com/-/media/dfe72332941949108b0d9e467da20da7.svg?la=en&hash=EDE2A66001ABEB06B025A6FCE73B85FF', description: 'Use our iOS app to generate and store strong passwords.' },
        { name: 'Mac', icon: 'https://www.lastpass.com/-/media/dfe72332941949108b0d9e467da20da7.svg?la=en&hash=EDE2A66001ABEB06B025A6FCE73B85FF', description: 'Generate and manage passwords directly from your Mac.' },
        { name: 'Windows', icon: 'https://www.lastpass.com/-/media/02fd3c51eb6b4ec58cb7f810ddb26947.svg?la=en&hash=68D3B2259F659C5FDFB8640FD586992F', description: 'Generate and store passwords securely on Windows.' },
        { name: 'Mozilla Firefox', icon: 'https://www.lastpass.com/-/media/0bca9bcaa7d1442f86f94a16e7525ecd.svg?la=en&hash=B9B9A4B8A9A0A787B5774AB5141FC812', description: 'Generate strong passwords with our Firefox extension.' },
        { name: 'Apple Safari', icon: 'https://www.lastpass.com/-/media/056f1882687642eaaf818513969ff592.svg?la=en&hash=651AEE0B279281DCD5B0E5EA857F4145', description: 'Generate and save strong passwords with our Safari extension.' },
        { name: 'Microsoft Edge', icon: 'https://www.lastpass.com/-/media/3779614c8f824752a176d758bd83a711.svg?la=en&hash=F53FF0347FD9EF7AA21A6A3D0D3E2834', description: 'Generate and store passwords securely with our Edge extension.' },
        { name: 'Opera Browser', icon: 'https://www.lastpass.com/-/media/a19e66a8dd2942ea8397c43ca26c7d3f.svg?la=en&hash=745A508049A55116A27776356C9B2FA7', description: 'Generate and manage strong passwords with our Opera extension.' },
        { name: 'And many more', icon: '/images/helmet 1.png', description: '' },
    ];

    useEffect(() => {
        AOS.init({ duration: 2000 });
        console.log('AOS initialized');
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
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://t4.ftcdn.net/jpg/06/67/04/01/240_F_667040109_YkiAQqxcVgitoMBncbsEBCqJuO9TxCU7.jpg')`, height: '85vh' }}>
                                {/* <img src="/images/headimg.png" alt="Slide 1" style={{ display: 'none' }} /> */}
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://t4.ftcdn.net/jpg/06/16/24/09/240_F_616240979_TF6g7XSSEn3nuRzsscp79jxEqZ4rLYzt.jpg')`, height: '85vh' }}>
                                <img src="/images/headimg3.png" alt="Slide 2" style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/cyber-security-technology-icon-firewall-antivirus-alert-protection-security-online-network-with-smartphone-cellphone-laptop-computer_42510-770.jpg?size=626&ext=jpg')`, height: '85vh' }}>
                                <img src="/images/headimg2.png" alt="Slide 3" style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/padlock-with-keyhole-symbol-personal-data-security-illustrates-cyber-data-information-privacy-idea_43778-486.jpg?size=626&ext=jpg&ga=GA1.1.1221799510.1721313508&semt=sph')`, height: '85vh' }}>
                                <img src="/images/headimg2.png" alt="Slide 3" style={{ display: 'none' }} />
                            </div>
                        </div>
                    </Slider>
                </div>

                <div className="absolute inset-0 z-10 bg-black bg-opacity-50 pointer-events-none"></div>
                <div className="relative z-20 w-full px-4 py-8">
                    <h1 className="text-5xl md:text-7xl mb-6">Password Generator</h1>
                    <p className="text-xl md:text-3xl mb-4">Secure, Strong, Customizable</p>
                    <p className="text-lg md:text-xl text-blue-200 mb-6">Generate strong, unique passwords to enhance your online security and protect your accounts.</p>
                    <div className="space-x-4">
                        <Link to='/plans' className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Personal Plan</Link>
                        <Link to='/plans' className="border-2 border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-full hover:text-white hover:bg-blue-600">Team Plan</Link>
                    </div>
                </div>
            </header>

            {/* benefits of Password Generator (cards) */}
            <section className="py-20 bg-gray-50 font">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-semibold mb-4">Enhance your security with our Password Generator</h2>
                    <div className="flex flex-wrap justify-center">
                        {dataSecurityCards.map((card, index) => (
                            <Tilt key={card.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                                <div
                                    className="bg-white rounded-full shadow-2xl p-8"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <img src={card.icon} alt={card.title} className="w-12 h-12 mb-4 mx-auto" />
                                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
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

            {/* Password generator detail section */}
            <div className="flex justify-center font">
                <div className="flex flex-col md:flex-row w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">

                    {/* Block 2: Image */}
                    {/* <div className="md:w-1/2 flex justify-center items-center">
                    <img src="https://img.freepik.com/premium-vector/digital-illustration-man-demonstrating-online-authentication-large-tablet-display_941526-2633.jpg?w=740" alt="Autofill Detail" className="w-full h-full z-2 object-cover" />
                    </div> */}
                    <div className="md:w-1/2 flex justify-center items-center">
                        <video
                            src="https://cdn.pixabay.com/video/2023/06/16/167453-837077437_tiny.mp4"
                            autoPlay
                            muted
                            loop
                            alt="Autofill Detail"
                            className="w-full h-full z-2 object-cover" />
                    </div>


                    {/* Block 1: Text Content */}
                    <div className="relative md:w-1/2 px-24 py-32 text-blue-600 flex flex-col justify-center">
                        <h1
                            className="text-5xl font-normal mb-4"
                            data-aos="fade-up"
                        >
                            What is Password<br /> Generator?
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

            {/* Platforms where available */}
            <section className="py-20 bg-gray-200 font">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-semibold mb-4">Available on Multiple Platforms</h2>
                    <div className="flex flex-wrap justify-center">
                        {platforms.map((platform, index) => (
                            <div
                                key={index}
                                className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col items-center">
                                    <img src={platform.icon} alt={platform.name} className="w-12 h-12 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                                    <p className="text-gray-600">{platform.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />
        </>
    );
};

export default PasswordGenerator;
