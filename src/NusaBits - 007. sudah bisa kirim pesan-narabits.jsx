import React, { useState, useEffect, useRef } from 'react';
import digitechIllust from "./images/digiblue_lorong.jpg";
import emailjs from '@emailjs/browser';

import {
    Menu, X, Moon, Sun, ChevronRight, ArrowRight, Code2,
    Smartphone, PenTool, Globe, Megaphone, MonitorPlay,
    Layers, Settings, Wrench, Briefcase, CheckCircle2,
    MapPin, Phone, Mail, MessageSquare, Linkedin, Twitter, Instagram
} from 'lucide-react';

// --- Helper Hooks ---

// Hook for scroll animations (Intersection Observer)
const useScrollReveal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return [ref, isVisible];
};

// Scroll Reveal Component
const Reveal = ({ children, delay = 0, direction = 'up' }) => {
    const [ref, isVisible] = useScrollReveal();

    const baseClasses = `transition-all duration-1000 ease-out`;
    const hiddenClasses = {
        up: 'opacity-0 translate-y-12',
        down: 'opacity-0 -translate-y-12',
        left: 'opacity-0 translate-x-12',
        right: 'opacity-0 -translate-x-12',
        scale: 'opacity-0 scale-95'
    };

    const visibleClasses = 'opacity-100 translate-y-0 translate-x-0 scale-100';

    return (
        <div
            ref={ref}
            className={`${baseClasses} ${isVisible ? visibleClasses : hiddenClasses[direction]}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useScrollReveal();

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// --- Main Application Component ---

export default function App() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            'service_cuo7nmf',      // ganti Service ID
            'template_4u1vhx4',     // ganti Template ID
            {
                from_name: formData.name,
                from_email: formData.email,
                company: formData.company,
                phone: formData.phone,
                message: formData.message,
                time: new Date().toLocaleString()
            },
            'Jh5kIxYEdZ-fsAhO5'        // ganti Public Key
        )
            .then(() => {
                alert('Pesan berhasil dikirim!');

                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    message: ''
                });
            })
            .catch((error) => {
                console.error(error);
                alert('Gagal mengirim pesan.');
            });
    };

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activePortfolioTab, setActivePortfolioTab] = useState('All');

    // Handle scroll events for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll to section
    const scrollTo = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navLinks = [
        { name: 'Home', id: 'home' },
        { name: 'About Us', id: 'about' },
        { name: 'Services', id: 'services' },
        { name: 'Portfolio', id: 'portfolio' },
        { name: 'Process', id: 'process' },
        { name: 'Testimonials', id: 'testimonials' },
        { name: 'Blog', id: 'blog' },
        { name: 'Contact', id: 'contact' },
    ];

    // Data Objects
    const services = [
        { icon: <Code2 size={24} />, title: 'Custom Software', desc: 'Tailored software solutions to address your unique business challenges.' },
        { icon: <Globe size={24} />, title: 'Web Development', desc: 'Responsive, scalable, and high-performance web applications.' },
        { icon: <Smartphone size={24} />, title: 'Mobile Apps', desc: 'Native and cross-platform mobile experiences for iOS and Android.' },
        { icon: <Layout size={24} />, title: 'UI/UX Design', desc: 'User-centric interfaces that engage and convert visitors.' },
        { icon: <Megaphone size={24} />, title: 'Digital Branding', desc: 'Establishing a strong, memorable digital presence for your brand.' },
        { icon: <MonitorPlay size={24} />, title: 'Content Production', desc: 'Engaging multimedia content that tells your brand story.' },
        { icon: <PenTool size={24} />, title: 'Graphic Design', desc: 'Stunning visuals for marketing, social media, and print.' },
        { icon: <Layers size={24} />, title: 'System Integration', desc: 'Connecting disparate systems for seamless data flow.' },
        { icon: <Wrench size={24} />, title: 'Maintenance', desc: 'Ongoing support and updates to keep your systems running smoothly.' },
        { icon: <Briefcase size={24} />, title: 'Consulting', desc: 'Strategic digital transformation guidance for enterprises.' },
    ];

    // Fallback for missing icon
    function Layout({ size }) {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>;
    }

    const portfolioItems = [
        { id: 1, title: 'FinTech Dashboard', category: 'Web Applications', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', tech: 'React, Node.js, AWS' },
        { id: 2, title: 'HealthTrack App', category: 'Mobile Applications', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80', tech: 'React Native, Firebase' },
        { id: 3, title: 'EcoCommerce', category: 'Web Applications', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80', tech: 'Next.js, Tailwind, Stripe' },
        { id: 4, title: 'Nexus Rebranding', category: 'Branding Projects', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80', tech: 'Illustrator, Figma' },
        { id: 5, title: 'Logistics Portal', category: 'Corporate Websites', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', tech: 'Vue.js, Laravel' },
        { id: 6, title: 'Foodie UI Kit', category: 'Creative Design', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', tech: 'Figma, Protopie' },
    ];

    const filteredPortfolio = activePortfolioTab === 'All'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activePortfolioTab);

    const processSteps = [
        { num: '01', title: 'Discovery & Consultation', desc: 'Understanding your vision, goals, and technical requirements.' },
        { num: '02', title: 'Planning & Design', desc: 'Creating blueprints, wireframes, and high-fidelity UI/UX designs.' },
        { num: '03', title: 'Development', desc: 'Agile coding and building the architecture of your solution.' },
        { num: '04', title: 'Testing & QA', desc: 'Rigorous testing to ensure bug-free, high-performance output.' },
        { num: '05', title: 'Launch & Deployment', desc: 'Smooth transition to live environments and app stores.' },
        { num: '06', title: 'Maintenance & Growth', desc: 'Ongoing optimization, support, and scaling strategies.' },
    ];

    return (
        <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans scroll-smooth`}>
            <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-hidden">

                {/* --- NAVIGATION --- */}
                <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 shadow-md py-4 transition-all duration-300 border-b border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
                            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                N
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Nusa<span className="text-blue-600">BITS</span>
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollTo(link.id)}
                                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
                            </button>

                            <button onClick={() => scrollTo('contact')} className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                Let's Talk
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 dark:text-white">
                                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl border-t border-slate-100 dark:border-slate-800 py-4 flex flex-col items-center gap-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollTo(link.id)}
                                    className="w-full text-center py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <button onClick={() => scrollTo('contact')} className="w-11/12 mx-auto py-3 mt-2 rounded-lg bg-blue-600 text-white font-medium shadow-md">
                                Let's Talk
                            </button>
                        </div>
                    )}
                </header>



                {/* --- HERO SECTION --- */}
                <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mt-16 lg:mt-0">

                    {/* Background Image Profesional - Tanpa Overlay Transparan */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={digitechIllust}
                            alt="Corporate Office Background"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    <div className="container mx-auto px-6 md:px-12 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                            {/* Text Content - Dibungkus Card agar kontras dengan background yang jernih */}
                            <div className="w-full lg:w-1/2 flex flex-col items-start text-left bg-white/95 dark:bg-slate-900/95 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100/50 dark:border-slate-700/50">
                                <Reveal direction="up" delay={100}>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        Indonesia's Premier Digital Agency
                                    </div>
                                </Reveal>

                                <Reveal direction="up" delay={200}>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white mb-6">
                                        Transforming Ideas Into <br className="hidden md:block" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                            Digital Innovation
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal direction="up" delay={300}>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                        NusaBITS delivers premium software development and creative digital solutions that help businesses grow, innovate, and succeed in the fast-paced digital era.
                                    </p>
                                </Reveal>

                                <Reveal direction="up" delay={400}>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                        <button onClick={() => scrollTo('contact')} className="px-8 py-4 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group">
                                            Start Your Project
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Hero Illustration - Digeser atau disesuaikan ukurannya agar background kanan lebih terlihat */}
                            

                        </div>
                    </div>
                </section>



                {/* --- ABOUT US --- */}
                <section id="about" className="py-24 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-5/12">
                                <Reveal direction="right">
                                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                                            alt="NusaBITS Team Working"
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                                            <div>
                                                <div className="text-white font-bold text-2xl mb-1">Empowering Growth</div>
                                                <div className="text-slate-300 text-sm">Through robust digital solutions</div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            <div className="w-full lg:w-7/12">
                                <Reveal direction="left" delay={100}>
                                    <div className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">Who We Are</div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                        A Technology & Digital Creative Powerhouse
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                        NusaBITS is a premier technology and digital creative company based in Indonesia, dedicated to helping organizations build impactful digital products and experiences. We combine deep technological expertise with creative innovation to deliver solutions that drive measurable business results.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { title: 'Professional Team', desc: 'Expert developers & designers.' },
                                            { title: 'Client-Focused', desc: 'Your success is our priority.' },
                                            { title: 'Agile Development', desc: 'Flexible & iterative process.' },
                                            { title: 'Creative Innovation', desc: 'Modern & forward-thinking.' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-start">
                                                <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SERVICES --- */}
                <section id="services" className="py-24 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-6 md:px-12">
                        <Reveal direction="up">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <div className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">Our Capabilities</div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                    Comprehensive Digital Services
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    End-to-end solutions spanning from conceptual design to robust software architecture and deployment.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {services.map((service, idx) => (
                                <Reveal key={idx} direction="up" delay={idx * 50}>
                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group h-full flex flex-col cursor-pointer">
                                        <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">{service.desc}</p>
                                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                                            Learn More <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- PORTFOLIO --- */}
                <section id="portfolio" className="py-24 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-6 md:px-12">
                        <Reveal direction="up">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                <div className="max-w-2xl">
                                    <div className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">Featured Work</div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                        Our Latest Success Stories
                                    </h2>
                                </div>

                                {/* Tabs */}
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Web Applications', 'Mobile Applications', 'Creative Design'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActivePortfolioTab(tab)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activePortfolioTab === tab
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPortfolio.map((item, idx) => (
                                <Reveal key={item.id} direction="up" delay={idx * 100}>
                                    <div className="group rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer">
                                        <div className="relative aspect-video overflow-hidden">
                                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900 dark:text-white">
                                                {item.category}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.tech}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <button className="px-8 py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                                View All Projects <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- WHY CHOOSE US (STATS) --- */}
                <section className="py-20 bg-blue-600 relative overflow-hidden">
                    {/* Background patterns */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="2" fill="none" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                        </svg>
                    </div>

                    <div className="container mx-auto px-6 md:px-12 relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
                            <Reveal direction="scale" delay={0}>
                                <div className="px-4">
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                                        <AnimatedCounter end={150} suffix="+" />
                                    </div>
                                    <div className="text-blue-100 font-medium">Successful Projects</div>
                                </div>
                            </Reveal>
                            <Reveal direction="scale" delay={100}>
                                <div className="px-4">
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                                        <AnimatedCounter end={98} suffix="%" />
                                    </div>
                                    <div className="text-blue-100 font-medium">Happy Clients</div>
                                </div>
                            </Reveal>
                            <Reveal direction="scale" delay={200}>
                                <div className="px-4">
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                                        <AnimatedCounter end={10} suffix="+" />
                                    </div>
                                    <div className="text-blue-100 font-medium">Years Experience</div>
                                </div>
                            </Reveal>
                            <Reveal direction="scale" delay={300}>
                                <div className="px-4">
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                                        24/7
                                    </div>
                                    <div className="text-blue-100 font-medium">Support Available</div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* --- WORK PROCESS --- */}
                <section id="process" className="py-24 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-6 md:px-12">
                        <Reveal direction="up">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <div className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">How We Work</div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                    Our Proven Delivery Process
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    A structured, agile methodology ensuring quality, transparency, and timely delivery.
                                </p>
                            </div>
                        </Reveal>

                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                                {processSteps.map((step, idx) => (
                                    <Reveal key={idx} direction="up" delay={idx * 100} className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl mb-6 relative">
                                            {step.num}
                                            {/* Active indicator dot */}
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900"></div>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- TESTIMONIALS --- */}
                <section id="testimonials" className="py-24 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-6 md:px-12">
                        <Reveal direction="up">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                    What Our Clients Say
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Budi Santoso', role: 'CEO, TechNusa', text: 'NusaBITS completely transformed our internal operations with a custom ERP system. Professional, fast, and incredibly reliable team.' },
                                { name: 'Siti Rahma', role: 'Founder, RetailPro', text: 'The e-commerce app they built for us increased our mobile sales by 150% in just three months. The UI/UX is world-class.' },
                                { name: 'Arif Wibowo', role: 'Director, GovTech ID', text: 'Their attention to security, scalability, and clean code architecture makes them the best tech partner we have ever worked with.' }
                            ].map((testimonial, idx) => (
                                <Reveal key={idx} direction="up" delay={idx * 150}>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl relative">
                                        <div className="text-blue-200 dark:text-blue-900/50 absolute top-4 right-6 text-6xl font-serif">"</div>
                                        <div className="flex text-yellow-400 mb-4">
                                            {[1, 2, 3, 4, 5].map(star => <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 italic mb-6 relative z-10">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                                <div className="text-xs text-slate-500">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>


                {/* --- CONTACT SECTION --- */}
                <section id="contact" className="py-24 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                            {/* Contact Info & Map */}
                            <div>
                                <Reveal direction="right">
                                    <div className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">Get In Touch</div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                        Ready to start your digital transformation?
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 mb-10">
                                        Reach out to our team to discuss your project requirements, request a quote, or explore how NusaBITS can help your business thrive.
                                    </p>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Office Location</h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">Sukorame, Gandusari, Trenggalek<br />Jawa Timur, Indonesia 66372</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">info@nusabits.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Call / WhatsApp</h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">+62 822 3544 2179</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Map */}
                                    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
                                        {/* Placeholder for iframe map */}
                                        <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400">
                                            <MapPin size={32} className="mb-2 text-blue-400" />
                                            <span className="text-sm font-medium">Interactive Google Map Here</span>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <Reveal direction="left">
                                    <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h3>

                                        <form
                                            className="space-y-4"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                                    <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white" placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, name: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white" placeholder="Your Company Ltd."
                                                        value={formData.company}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, company: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                                                    <input type="email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white" placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, email: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                                                    <input type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white" placeholder="+62 811..."
                                                        value={formData.phone}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, phone: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Message / Project Details</label>
                                                <textarea required rows="4" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white resize-none" placeholder="Tell us about your requirements..."
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, message: e.target.value })
                                                    }
                                                />
                                                   
                              
                                            </div>

                                            <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 mt-4">
                                                Send Message
                                            </button>
                                        </form>
                                    </div>
                                </Reveal>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                        N
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">
                                        Nusa<span className="text-blue-600">BITS</span>
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    Transforming ideas into digital innovation. We build scalable software and creative solutions for tomorrow's leading brands.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={18} /></a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Twitter size={18} /></a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Instagram size={18} /></a>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6">Menu Links</h4>
                                <ul className="space-y-3 text-sm">
                                    {['Home', 'About Us', 'Portfolio', 'Process', 'Blog / Insights'].map(link => (
                                        <li key={link}><a href="#" className="hover:text-blue-400 transition-colors">{link}</a></li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6">Services</h4>
                                <ul className="space-y-3 text-sm">
                                    {['Software Development', 'Web Applications', 'Mobile Apps', 'UI/UX Design', 'Digital Branding'].map(link => (
                                        <li key={link}><a href="#" className="hover:text-blue-400 transition-colors">{link}</a></li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6">Quick Contact</h4>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex items-center gap-3">
                                        <Mail size={16} className="text-blue-500" /> info@nusabits.com
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Phone size={16} className="text-blue-500" /> +62 822 3544 2179
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <MapPin size={16} className="text-blue-500 shrink-0 mt-1" />
                                        <span>Sukorame, Gandusari, Trenggalek<br />Jawa Timur, Indonesia 66372</span>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                            <p>Copyright © {new Date().getFullYear()} NusaBITS. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* --- FLOATING WHATSAPP BUTTON --- */}
                <a
                    href="https://wa.me/6281123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 hover:bg-green-600 transition-all cursor-pointer group"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageSquare size={28} />
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us!
                    </span>
                </a>

            </div>
        </div>
    );
}