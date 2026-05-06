import Button from "../components/ui/Button"
import useAuth from "../hooks/useAuth"
import { NavLink } from 'react-router';
import { LayoutDashboard } from 'lucide-react';
import { BriefcaseMedical } from 'lucide-react';
import { Users } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { CircleQuestionMark } from 'lucide-react';
import { Phone } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Star } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { Calendar } from 'lucide-react';

const AdminSidebar = () => {

    const { logout } = useAuth();

    const navLinks = [
        { href: "/admin/dashboard", icon: <LayoutDashboard size={16}/>, label: "Dashboard" },
        { href: "/admin/services", icon: <BriefcaseMedical size={16}/>, label: "Services" },
        { href: "/admin/vets", icon: <Users size={16}/>, label: "Vets" },
        { href: "/admin/blogs", icon: <BookOpen size={16}/>, label: "Blogs" },
        { href: "/admin/faqs", icon: <CircleQuestionMark size={16}/>, label: "FAQs" },
        { href: "/admin/emergency-contact", icon: <Phone size={16}/>, label: <span>Emergency<br/>Contact</span> },
        { href: "/admin/location", icon: <MapPin size={16}/>, label: "Location" },
        { href: "/admin/reviews", icon: <Star size={16}/>, label: "Reviews" },
        { href: "/admin/contacts", icon: <MessageSquare size={16}/>, label: "Contacts" },
        { href: "/admin/appointments", icon: <Calendar size={16}/>, label: "Appointments" },
    ]

    return (
        <div className="w-59 min-h-screen border-4 border-mc-primary">
            <div className="flex flex-col gap-5">

                {/* Sidebar Header */}
                <div className="font-pixel-alt text-xl font-medium pl-6.5 py-6 border-b-4 border-mc-primary bg-mc-grass">
                    <span>ANIMALIA<br/>ADMIN PANEL</span>
                </div>

                {/* Sidebar Body */}
                <div className="flex flex-col justify-between px-6 pb-7.5 min-h-[calc(90vh-50px)]">
                    <div className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                                <NavLink 
                                    key={link.href}
                                    to={link.href}
                                    className={({ isActive }) => 
                                        `flex items-center  gap-2 text-sm font-semibold font-sans px-3 py-3 transition-colors
                                        ${isActive ? 'bg-mc-grass text-white shadow-mc-sharp-b' : 'hover:bg-mc-creeper'}`
                                    }>
                                    {link.icon}
                                    {link.label}
                                </NavLink>
                        ))}
                    </div>
                    <Button 
                        onClick={ logout }
                        className="font-pixel-alt text-xl font-medium py-1 w-full shadow-mc-sharp-b"
                    >Sign out</Button>    
                </div>
            </div>
        </div>
    )
}
export default AdminSidebar