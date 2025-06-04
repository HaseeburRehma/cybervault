"use client"

import { useEffect } from "react"
import Slider from "react-slick"
import AOS from "aos"
import "aos/dist/aos.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "../style.css"

const Header = () => {
    useEffect(() => {
        AOS.init({ duration: 2000 })
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    }

    return (
        <header className="relative bg-white h-screen flex items-center justify-start text-left font-tomato">

            <img src='/images/padlock.png' alt='padlock' className='absolute right-0 opacity-100' style={{ zIndex: '10', bottom: '-51px' }} />
            <div className="absolute inset-0">
                <Slider {...settings}>
                    <div>
                        <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url('/images/headimg.png')` }}></div>
                    </div>
                    <div>
                        <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url('/images/headimg3.png')` }}></div>
                    </div>
                    <div>
                        <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url('/images/headimg2.png')` }}></div>
                    </div>
                </Slider>
            </div>
            <div className="relative z-10 container mx-auto px-3" data-aos="fade-up">
                <img src="/images/helmet 1.png" alt="VaultGuard Icon" className="absolute top-10 left-48 w-24 h-24" />
                <h2 className="text-3xl font-bold mb-2" style={{ color: "#10B981" }}>
                    VaultGuard Pro
                </h2>
                <h1 className="text-5xl font-bold mb-4">
                    Smart <br /> Secure <br /> Effective <span className="text-6xl">.</span>
                </h1>
                <div className="text-lg font-bold mb-6">
                    Advanced password management solution for securely storing, <br />
                    managing, and sharing your digital credentials.
                </div>
                <div className="space-x-4">
                    <a
                        href="#personal-plan"
                        className="border-2 border-emerald-600 text-emerald-600 px-4 py-2 rounded-full hover:text-white hover:bg-emerald-600"
                    >
                        Personal Plan
                    </a>
                    <a
                        href="#team-plan"
                        className="border-2 border-emerald-600 text-emerald-600 px-4 py-2 rounded-full hover:text-white hover:bg-emerald-600"
                    >
                        Team Plan
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header
