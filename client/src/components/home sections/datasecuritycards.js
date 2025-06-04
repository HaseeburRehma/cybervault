import React, { useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style.css';

const dataSecurityCards = [
    {
        id: 1,
        icon: '/images/ds1.png', // Replace with the actual icon path
        title: 'Powerful Security',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        link: '#',
    },
    {
        id: 2,
        icon: '/images/ds2.png', // Replace with the actual icon path
        title: 'Unlimited passwords',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        link: '#',
    },
    {
        id: 3,
        icon: '/images/ds3.png', // Replace with the actual icon path
        title: 'End-to-end Encryption',
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

const DataSecurityCards = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, delay: 200 });
    }, []);

    return (
        <section className="py-20 bg-gray-50 font">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4">Specialized Data Security Modules</h2>
                <p className="text-lg text-green-600 font-medium mb-12">Everything you need out of a Password manager</p>
                <div className="flex flex-wrap justify-center">
                    {dataSecurityCards.map((card, index) => (
                        <Tilt key={card.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                            <div
                                className="bg-white rounded-lg shadow-2xl p-8"
                                data-aos="fade-up"
                                data-aos-delay={(index + 1) * 200}
                            >
                                <div className="mb-6">
                                    <img src={card.icon} alt={card.title} className="mx-auto h-16" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-gray-600 mb-4">{card.description}</p>
                                <a href={card.link} className="text-green-600 hover:text-green-800">
                                    Learn More →
                                </a>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DataSecurityCards;
