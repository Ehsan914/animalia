import { Link, NavLink } from 'react-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import { PixelPaw } from '../icons/pixel-icons';

export default function Navbar() {
    
    const [ isOpen, setIsOpen ] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/vets", label: "Our Vets" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <nav className='sticky top-0 z-50 bg-white border-2 border-mc-primary shadow-mc-flat'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16 nav:h-20'>
                    <Link to='/' className='flex gap-1'>
                        <PixelPaw className='w-8 h-8 text-mc-primary'/>
                        <div className='flex flex-col gap-1 font-pixel text-mc-primary'>
                            <p className='m-0 text-xs'>Animalia</p>
                            <p className='m-0 text-[10px]'>Vet Clinic</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden nav:flex items-center gap-1'>
                        {navLinks.map((link) => (
                            <NavLink 
                            key={link.href} 
                            to={link.href}
                            className={( {isActive}) => 
                                `text-sm font-semibold font-sans px-4 py-2 hover:bg-mc-creeper transition-colors
                                ${isActive ? 'bg-mc-creeper' : ''}`
                            }>
                                {link.label}
                            </NavLink>
                        ))}
                        <Link to='/appointment'>
                            <Button className='ml-4 px-6 py-2 text-[8px] font-pixel'>Book Now</Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        className='nav:hidden p-2 text-black'
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                
                {/* Mobile Navigation */}
                {isOpen && (
                    <div className='nav:hidden pb-4 border-t-2 border-mc-primary'>
                        <div className='flex flex-col gap-1 pt-4'>
                            {navLinks.map((link) => (
                                <NavLink
                                    to={link.href}
                                    key={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={({isActive}) => `
                                    px-4 py-3 text-sm font-medium text-black hover:bg-mc-creeper transition-colors
                                    ${isActive ? 'bg-mc-creeper' : ''}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            <Link to='/appointment' className='w-full px-4 mt-2' onClick={() => setIsOpen(false)}>
                                <Button className='w-full px-6 py-3 text-[8px] font-pixel'>Book Now</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )

}