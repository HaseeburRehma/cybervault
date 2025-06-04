import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const testimonials = [
    {
        image: 'https://cdn-icons-png.flaticon.com/128/9408/9408175.png',
        name: 'John Doe',
        position: 'CEO, CipherText',
        text: 'I’ve been searching for a good free slider plugin for a long time. This is definitely the one! For a free plugin it does a lot of things!',
        rating: 5,
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/128/3135/3135789.png',
        name: 'Jane Smith',
        position: 'CEO, NullByte',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        rating: 5,
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/128/236/236832.png',
        name: 'Robert Brown',
        position: 'CEO, StarkTech',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        rating: 5,
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/128/219/219970.png',
        name: 'Emily White',
        position: 'CEO, Loxium',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        rating: 5,
    },
];

const Testimonials = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="testimonial-container py-7 flex flex-col items-center font" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '50vh' }}>
            <h2 className="text-4xl font-bold text-center text-white mb-10" data-aos="fade-up">What Our Clients Say</h2>
            <Slider {...settings} className="w-full max-w-4xl" data-aos="fade-up">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6">
                        <div className="testimonial-card p-8 rounded-lg flex flex-col items-center text-center" style={{ backgroundColor: 'transparent' }}>
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-24 h-24 rounded-full mb-4 border-4 border-white"
                                data-aos="zoom-in"
                                data-aos-delay={`${index * 100}`}
                            />
                            <p className="text-white text-lg italic mb-6" data-aos="fade-up" data-aos-delay={`${index * 100}`}>"{testimonial.text}"</p>
                            <h3 className="text-white text-xl font-bold mb-1" data-aos="fade-up" data-aos-delay={`${index * 100}`}>{testimonial.name}</h3>
                            <p className="text-gray-400 text-sm" data-aos="fade-up" data-aos-delay={`${index * 100}`}>{testimonial.position}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Testimonials;
