import { useState } from 'react';
import {
    Instagram,
    Youtube,
    Facebook,
    Twitter,
    Mail,
    Phone,
    MapPin,
    Heart,
    Star,
    Users,
    BookOpen,
    Award,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import lasaImage from '@/assets/Logo.jpg';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Newsletter subscription:', email);
        setEmail('');
    };

    const socialStats = [
        { icon: Instagram, count: '4K+', label: 'Followers', color: 'text-pink-500', url: 'https://www.instagram.com/kapalingitatales?igsh=ajl0MDg4cGhycnJq' },
        { icon: Youtube, count: '2K+', label: 'Subscribers', color: 'text-red-500', url: 'https://www.youtube.com/@YourChannelName' },
        { icon: Facebook, count: '1K+', label: 'Likes', color: 'text-blue-500', url: 'https://www.facebook.com/share/1CLAXpeC6x/' },
        { icon: Twitter, count: '800+', label: 'Followers', color: 'text-sky-500', url: 'https://x.com/YourTwitterHandle' },
    ];

    const communityStats = [
        { icon: Users, count: '10,000+', label: 'Active Readers' },
        { icon: BookOpen, count: '500+', label: 'Books Available' },
        { icon: Star, count: '4.8/5', label: 'Average Rating' },
        { icon: Award, count: '50+', label: 'Featured Authors' },
    ];

    return (
        <footer className="bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                    }}
                ></div>
            </div>

            <div className="relative z-10">
                {/* Community Section */}
                <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Join the Community
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2">
                            Join 10,000+ seekers already walking with us on this incredible journey of knowledge and discovery.
                        </p>

                        {/* Social Media Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16">
                            {socialStats.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group cursor-pointer touch-manipulation no-underline"
                                >
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105 active:scale-95">
                                        <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-slate-700/50 mb-2 sm:mb-3 md:mb-4 group-hover:bg-slate-600/50 transition-colors ${social.color}`}>
                                            <social.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{social.count}</div>
                                        <div className="text-xs sm:text-sm text-slate-400">{social.label}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Community Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
                            {communityStats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-3 sm:mb-4">
                                        <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
                                    </div>
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white">{stat.count}</div>
                                    <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="border-t border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {/* Brand Section */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <img
                                        src={lasaImage}
                                        alt="Kapalin Tales"
                                        className="h-8 sm:h-10 md:h-12 w-auto mr-3 sm:mr-4"
                                    />
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold">Kapalin Tales</h3>
                                        <p className="text-sm sm:text-base text-slate-400">Your Digital Library</p>
                                    </div>
                                </div>
                                <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-md">
                                    Discover, read, and share amazing stories from talented authors around the world.
                                    Join our community of book lovers and embark on endless adventures.
                                </p>


                            </div>

                            {/* Quick Links */}
                            <div className="mt-6 md:mt-0">
                                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
                                <ul className="space-y-2 sm:space-y-3">
                                    {['Browse Books', 'Featured Authors', 'New Releases', 'Categories', 'Bestsellers'].map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors duration-200 touch-manipulation">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6 md:mt-0">
                                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Get in Touch</h4>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center text-slate-300">
                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                                        <span className="text-sm sm:text-base break-all">Kapalingitatales@gmail.com</span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                                        <span className="text-sm sm:text-base">+91 93379 62617</span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                                        <span className="text-sm sm:text-base">Odisha, Bhubaneswar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center text-slate-400 text-sm sm:text-base text-center">
                                <span>Made with</span>
                                <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
                                <span>© 2024 Kapalin Tales. All rights reserved.</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                                <a href="#" className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors touch-manipulation">Privacy Policy</a>
                                <a href="#" className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors touch-manipulation">Terms of Service</a>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={scrollToTop}
                                    className="text-slate-400 hover:text-white text-sm sm:text-base touch-manipulation"
                                >
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Back to Top
                                </Button>
                            </div>
                            {/* Social Media Links - moved outside to avoid nesting issues */}
                            <div className="flex items-center justify-center mt-4 gap-4">
                                <a
                                    href="https://www.facebook.com/share/1CLAXpeC6x/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a
                                    href="https://www.instagram.com/kapalingitatales?igsh=ajl0MDg4cGhycnJq"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-slate-400 hover:text-pink-500 transition-colors"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;