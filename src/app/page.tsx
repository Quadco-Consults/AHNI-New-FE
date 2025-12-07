"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  FileText,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Globe
} from "lucide-react";
import { getAccessToken } from "utils/auth";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check authentication for navigation button display
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  // Hero carousel data - AHNI focused content
  const carouselSlides = [
    {
      image: "/img/healthcare-safety.jpg",
      title: "Healthcare Excellence",
      subtitle: "Empowering Health Systems Across Nigeria",
      description: "Leading healthcare initiatives with comprehensive safety protocols and community engagement programs to improve quality of life for vulnerable populations"
    },
    {
      image: "/img/leadership-conference.jpg",
      title: "Strategic Partnerships",
      subtitle: "Building Sustainable Development",
      description: "Bringing together healthcare leaders, policymakers, and stakeholders to strengthen Nigeria's healthcare infrastructure through innovative solutions"
    },
    {
      image: "/img/education.jpg",
      title: "Research & Development",
      subtitle: "Evidence-Based Solutions",
      description: "Supporting health research and development initiatives to create evidence-based policies that drive sustainable socio-economic development"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Quick access menu items
  const menuItems = [
    {
      title: "Current Opportunities",
      description: "Explore jobs, RFQs, EOIs, consultant, facilitator, adhoc, and subgrant opportunities",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600",
      route: "/opportunities"
    },
    {
      title: "About AHNI",
      description: "Learn about our mission, vision, and commitment to healthcare excellence",
      icon: <Heart className="h-8 w-8" />,
      color: "bg-green-100 text-green-600",
      route: "/about"
    },
    {
      title: "Focus Areas",
      description: "Discover our key areas of impact and strategic initiatives",
      icon: <Globe className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600",
      route: "/focus-areas"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team for partnerships and support",
      icon: <Mail className="h-8 w-8" />,
      color: "bg-orange-100 text-orange-600",
      route: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNI Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                  style={{ width: 'auto', height: '40px' }}
                />
                <div className="hidden md:block">
                  <h1 className="font-bold text-xl text-foreground tracking-tight">AHNI Portal</h1>
                  <p className="text-sm text-muted-foreground font-medium">Achieving Health Initiatives Nigeria</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={() => router.push('/opportunities')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Opportunities
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/about')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/focus-areas')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Focus Areas
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/contact')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Contact
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2 border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Vendor Portal</span>
                <span className="sm:hidden">Vendor</span>
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Staff Portal</span>
                <span className="sm:hidden">Staff</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative w-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              {/* Image on Top */}
              <div className="w-full h-[50vh] relative">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              {/* Content Below Image */}
              <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground py-16 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-3xl text-primary-foreground/90 mb-8 font-semibold">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl text-primary-foreground/80 font-medium leading-relaxed max-w-3xl mx-auto">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-secondary'
                    : 'bg-primary-foreground/60 hover:bg-primary-foreground/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Menu */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Welcome to AHNI Portal</h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
              Your gateway to healthcare opportunities, partnerships, and information about Achieving Health Initiatives Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white"
                onClick={() => router.push(item.route)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${item.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6 font-medium">
                    {item.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="default"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all font-semibold shadow-sm hover:shadow-md w-full"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">Our Mission</h2>
            <p className="text-2xl md:text-3xl text-muted-foreground font-semibold leading-relaxed mb-10 max-w-4xl mx-auto">
              We enable socio-economic development in Nigeria by supporting health and research,
              with improved quality of life for people, especially vulnerable groups.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/about')}
              className="font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
            >
              Learn More About AHNI
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Get In Touch</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Ready to partner with us or explore opportunities?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-muted-foreground font-semibold">info@ahnigeria.org</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Phone</h3>
                <p className="text-muted-foreground font-semibold">+234 (0) 123 456 7890</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Location</h3>
                <p className="text-muted-foreground font-semibold">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="font-bold text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all"
              >
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Image
                src="/imgs/logo.png"
                alt="AHNI Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <span className="font-bold text-xl text-white">AHNI Portal</span>
                <p className="text-white/80 font-medium">Achieving Health Initiatives Nigeria</p>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-white/80">
              <button
                onClick={() => router.push('/opportunities')}
                className="hover:text-white transition-colors font-semibold hover:underline"
              >
                Opportunities
              </button>
              <button
                onClick={() => router.push('/about')}
                className="hover:text-white transition-colors font-semibold hover:underline"
              >
                About
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="hover:text-white transition-colors font-semibold hover:underline"
              >
                Contact
              </button>
              <a
                href="https://ahnigeria.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-semibold hover:underline"
              >
                Main Website
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center text-white/70">
            <p className="font-medium">&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}