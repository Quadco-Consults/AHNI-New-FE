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
  Globe,
  Home
} from "lucide-react";
import { getAccessToken } from "@/utils/auth";
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
      subtitle: "A Healthy and Safe Society Where Everyone Thrives",
      description: "Providing health technical assistance to Nigeria's public health sector through inclusive and innovative community-led programming since 2009"
    },
    {
      image: "/img/leadership-conference.jpg",
      title: "Strategic Partnerships",
      subtitle: "Partnering for Impact",
      description: "Working alongside government agencies and international partners like USAID, CDC, Global Fund, UNICEF, and FCDO to combat HIV/AIDS, TB, and malaria"
    },
    {
      image: "/img/education.jpg",
      title: "Community-Led Solutions",
      subtitle: "Empowering Communities Across Nigeria",
      description: "Supporting socio-economic advancement through health and research initiatives with operations spanning five geopolitical zones from our Abuja headquarters"
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
      title: "About AHNi",
      description: "Learn about our mission, vision, core values, and 13+ years of community-led health programming",
      icon: <Heart className="h-8 w-8" />,
      color: "bg-green-100 text-green-600",
      route: "/about"
    },
    {
      title: "Focus Areas",
      description: "HIV/AIDS, TB, Malaria, Reproductive Health, Health Systems Strengthening across Nigeria",
      icon: <Globe className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600",
      route: "/focus-areas"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our Abuja headquarters for partnerships and technical assistance",
      icon: <Mail className="h-8 w-8" />,
      color: "bg-orange-100 text-orange-600",
      route: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNI Logo"
                  width={45}
                  height={45}
                  className="h-11 w-auto"
                  style={{ width: 'auto', height: '44px' }}
                />
                <div className="hidden md:block">
                  <h1 className="font-bold text-2xl text-foreground tracking-tight">AHNi Portal</h1>
                  <p className="text-base text-muted-foreground font-medium">Achieving Health Nigeria initiative</p>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/opportunities')}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-lg px-6 py-3 h-auto"
              >
                Opportunities
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/about')}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-lg px-6 py-3 h-auto"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/focus-areas')}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-lg px-6 py-3 h-auto"
              >
                Focus Areas
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/contact')}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-lg px-6 py-3 h-auto"
              >
                Contact
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2 border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all shadow-sm hover:shadow-md text-base px-5 py-3 h-auto"
              >
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">Vendor Portal</span>
                <span className="sm:hidden">Vendor</span>
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all text-base px-5 py-3 h-auto"
              >
                <Shield className="h-5 w-5" />
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
              {/* Full Height Image with Content Overlay */}
              <div className="w-full h-[70vh] relative">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-full text-center max-w-6xl px-6 lg:px-12">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight text-white">
                      {slide.title}
                    </h1>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl text-white/95 mb-10 font-semibold leading-tight">
                      {slide.subtitle}
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl text-white/85 font-medium leading-relaxed max-w-5xl mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg"
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
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="w-full max-w-none">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight">Welcome to AHNi Portal</h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium max-w-5xl mx-auto leading-relaxed">
              Your gateway to healthcare opportunities, partnerships, and information about Achieving Health Nigeria initiative
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-8xl mx-auto">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white"
                onClick={() => router.push(item.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 ${item.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg leading-relaxed mb-8 font-medium">
                    {item.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all font-semibold shadow-sm hover:shadow-md w-full text-base py-3"
                  >
                    Explore
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40">
        <div className="w-full max-w-none">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-12 tracking-tight">Our Mission</h2>
            <p className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-semibold leading-relaxed mb-12 max-w-5xl mx-auto">
              Improved quality of life for people, especially vulnerable groups, through inclusive and innovative community-led programming.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/about')}
              className="font-bold text-xl px-10 py-5 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 h-auto"
            >
              Learn More About AHNi
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Partners & Funders */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="w-full max-w-none">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight">Our Partners</h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium max-w-5xl mx-auto leading-relaxed mb-16">
              Working alongside government agencies and international partners to strengthen Nigeria's healthcare systems
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-center justify-center mb-8">
              {/* Government of Nigeria */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/GOVT OF NIGERIA.jpeg"
                      alt="Government of Nigeria Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">Government of Nigeria</p>
                </div>
              </div>

              {/* The Global Fund */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/GF AIDS AND TB.jpg"
                      alt="The Global Fund Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">The Global Fund</p>
                  <p className="text-sm text-gray-600">AIDS, TB & Malaria</p>
                </div>
              </div>

              {/* USAID */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/idBZNTby4A_1765148566781.svg"
                      alt="USAID Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">USAID</p>
                  <p className="text-sm text-gray-600">From the American People</p>
                </div>
              </div>

              {/* UK Aid */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/ukaid2.png.jpeg"
                      alt="UK Aid Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">UK Aid</p>
                  <p className="text-sm text-gray-600">From the British People</p>
                </div>
              </div>

              {/* UNICEF */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/Logo_of_UNICEF.svg.png"
                      alt="UNICEF Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">UNICEF</p>
                  <p className="text-sm text-gray-600">UN Children's Fund</p>
                </div>
              </div>

              {/* FHI360 */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/id7T80qjOv_1765148519754.png"
                      alt="FHI360 Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">FHI360</p>
                  <p className="text-sm text-gray-600">Science of Improving Lives</p>
                </div>
              </div>

              {/* UNFPA */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/UNFPA_logo.svg.png"
                      alt="UNFPA Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">UNFPA</p>
                  <p className="text-sm text-gray-600">UN Population Fund</p>
                </div>
              </div>

              {/* UNHCR */}
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image
                      src="/img/UNHCR.svg.png"
                      alt="UNHCR Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-semibold text-lg text-gray-800">UNHCR</p>
                  <p className="text-sm text-gray-600">UN Refugee Agency</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Plus additional partners including CDC, FCDO, TAConnect, and other international development organizations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="w-full max-w-none">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight">Get In Touch</h2>
              <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
                Ready to partner with us or explore opportunities?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 text-center mb-16">
              <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md">
                  <Mail className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Email</h3>
                <p className="text-muted-foreground font-semibold text-lg">AHNiOperations@ahnigeria.org</p>
              </div>

              <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Phone</h3>
                <p className="text-muted-foreground font-semibold text-lg">+234.94615555</p>
              </div>

              <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Location</h3>
                <p className="text-muted-foreground font-semibold text-lg">No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="font-bold text-xl px-10 py-5 border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all h-auto"
              >
                Contact Us
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground text-white py-16 px-6 lg:px-12">
        <div className="w-full max-w-none">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <Image
                src="/imgs/logo.png"
                alt="AHNI Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <div>
                <span className="font-bold text-2xl text-white">AHNi Portal</span>
                <p className="text-white/80 font-medium text-lg">Achieving Health Nigeria initiative</p>
              </div>
            </div>

            <div className="flex items-center space-x-10 text-white/80">
              <button
                onClick={() => router.push('/opportunities')}
                className="hover:text-white transition-colors font-semibold hover:underline text-lg"
              >
                Opportunities
              </button>
              <button
                onClick={() => router.push('/about')}
                className="hover:text-white transition-colors font-semibold hover:underline text-lg"
              >
                About
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="hover:text-white transition-colors font-semibold hover:underline text-lg"
              >
                Contact
              </button>
              <a
                href="https://ahnigeria.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-semibold hover:underline text-lg"
              >
                Main Website
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p className="font-medium text-lg">&copy; 2024 Achieving Health Nigeria initiative (AHNi). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}