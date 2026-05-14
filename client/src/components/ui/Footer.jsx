import { AnimaliaLogoWhite, Heart, PixelHeart, PixelPaw, WhitePaw } from "../icons/pixel-icons";
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon } from '../icons/pixel-icons';

const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/vets", label: "Our Vets" },
    { href: "/blog", label: "Blog" },
]

const services = [
    { href: "/services#checkup", label: "Check-up" },
    { href: "/services#consultations", label: "Consultations" },
    { href: "/services#vaccinations", label: "Vaccinations" },
    { href: "/services#surgeries", label: "Surgeries" },
]


export default function Footer() {
    return (
        <footer className="bg-mc-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 nav:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to='/' className='flex items-center gap-2'>
                            <AnimaliaLogoWhite className='w-12 h-10'/>
                            <div className='flex flex-col gap-1 font-pixel text-white'>
                                <p className='m-0 text-xs tracking-wide'>Animalia</p>
                                <div className='flex items-center gap-2'>
                                    <p className='m-0 text-[10px]'>Vet Care</p>
                                    <WhitePaw className='w-2.5 h-2.5'/>
                                </div>
                            </div>
                        </Link>
                        <p className="text-sm text-white/80">
                            Compassionate care for your beloved pets. Professional veterinary services you can trust.
                        </p>
                        <div className="flex gap-4">
                            <FacebookIcon className="w-8 h-8" />  
                            <InstagramIcon className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-pixel text-[10px] mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white/80 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-pixel text-[10px] mb-4 text-white">Services</h3>
                        <ul className="space-y-2">
                            {services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white/80 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-pixel text-[10px] mb-4 text-white">Contact</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>Oli Miar Tek , Shewrapara<br/> Mirpur Dhaka</li>
                            <li>Phone Number: 01533829537</li>
                            <li>Email: veteasin@animalia.com</li>
                            <li>
                                <span className="font-semibold text-white">Emergency: 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t-2 border-white/20 flex flex-col nav:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/80">
                        &copy; {new Date().getFullYear()} <b>Animalia Vet Clinic</b>. All rights reserved.
                    </p>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                        Made with <Heart className="w-4 h-4"/> for pets
                    </p>
                </div>
            </div>
        </footer>
    )
}