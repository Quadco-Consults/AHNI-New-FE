"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Globe,
  Phone,
  Mail,
  MapPin,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { getAccessToken } from "utils/auth";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  // Carousel data
  const carouselSlides = [
    {
      image: "/img/healthcare-safety.jpg", // Healthcare workers with Stay Safe messaging
      title: "Healthcare Excellence",
      subtitle: "Community Health & Safety",
      description: "Leading healthcare initiatives across Nigeria with comprehensive safety protocols and community engagement programs"
    },
    {
      image: "/img/leadership-conference.jpg", // Professional conference/meeting
      title: "Strategic Leadership",
      subtitle: "Building Healthcare Systems",
      description: "Bringing together healthcare leaders, policymakers, and stakeholders to strengthen Nigeria's healthcare infrastructure"
    },
    {
      image: "/img/education.jpg", // Young girl with educational materials
      title: "Future Generations",
      subtitle: "Education & Empowerment",
      description: "Investing in the next generation through quality education and empowering young minds to build Nigeria's healthcare future"
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

  // Auto-redirect for authenticated users (optional - remove if you want them to see landing page)
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push("/dashboard");
  //   }
  // }, [isAuthenticated, router]);


  const recentOpportunities = [
    {
      title: "Medical Equipment Procurement",
      type: "National Open Tender",
      deadline: "2024-11-15",
      status: "Active",
      category: "Medical Equipment"
    },
    {
      title: "IT Infrastructure Upgrade",
      type: "Limited Solicitation",
      deadline: "2024-11-20",
      status: "Active",
      category: "Information Technology"
    },
    {
      title: "Facility Maintenance Services",
      type: "Expression of Interest",
      deadline: "2024-11-30",
      status: "Active",
      category: "Facility Management"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header - White Background */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNI Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#opportunities" className="text-foreground/80 hover:text-primary transition-colors font-medium">Opportunities</a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">About</a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contact</a>
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/vendor-portal/login')}
                    className="flex items-center space-x-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light"
                  >
                    <Users className="h-4 w-4" />
                    <span>Vendor Portal</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    className="flex items-center space-x-2 font-light"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Staff Portal</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative w-full">
          {/* Carousel Slides */}
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              {/* Image on Top */}
              <div className="w-full h-[50vh] relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Below Image */}
              <div className="bg-gradient-to-r from-primary via-primary to-primary text-primary-foreground py-12 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                  <h1 className="text-3xl md:text-5xl font-light mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-secondary mb-6 font-normal">
                    {slide.subtitle}
                  </h2>
                  <p className="text-base md:text-lg text-primary-foreground/90 font-light leading-relaxed max-w-2xl mx-auto">
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

      {/* Mission Section with Background Image */}
      <section className="relative py-20 px-4 bg-[url('/imgs/LoginImage.png')] bg-cover bg-center bg-no-repeat">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary/60"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-primary-foreground mb-6">Our Mission</h2>
            <p className="text-xl text-primary-foreground/90 font-light leading-relaxed mb-8">
              Providing solutions that are essential to the advancement of human development
              in communities we serve across Nigeria.
            </p>
            <p className="text-lg text-primary-foreground/80 font-light leading-relaxed mb-12">
              Through innovative healthcare solutions and community partnerships, we empower healthcare organizations
              to deliver better outcomes and strengthen community health initiatives.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
                <h3 className="font-light text-primary-foreground mb-2">Community Health Focus</h3>
                <p className="text-sm text-primary-foreground/80 font-light">Strengthening healthcare delivery in communities</p>
              </div>

              <div className="text-center">
                <div className="bg-primary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
                <h3 className="font-light text-primary-foreground mb-2">Innovation-Driven Solutions</h3>
                <p className="text-sm text-primary-foreground/80 font-light">Modern healthcare solutions and best practices</p>
              </div>

              <div className="text-center">
                <div className="bg-primary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
                <h3 className="font-light text-primary-foreground mb-2">Sustainable Development</h3>
                <p className="text-sm text-primary-foreground/80 font-light">Long-term impact for lasting change</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Opportunities Section */}
      <section id="opportunities" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-foreground mb-4">Current Opportunities</h2>
            <p className="text-lg text-muted-foreground font-light">Active procurement opportunities and expressions of interest</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {recentOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-xl transition-all backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={opportunity.type === "National Open Tender" ? "default" : "secondary"}>
                      {opportunity.type}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary">
                      {opportunity.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-light">{opportunity.title}</CardTitle>
                  <CardDescription className="font-light">{opportunity.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="font-light">Due: {opportunity.deadline}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/eoi')}
                            className="font-light">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => router.push('/eoi')} size="lg" className="font-light">
              View All Opportunities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-muted/20 via-background to-accent/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-foreground mb-6">About AHNI</h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed font-light">
              Achieving Health Initiatives Nigeria (AHNI) is dedicated to advancing healthcare delivery
              across Nigeria through innovative solutions and community engagement. We work to strengthen
              healthcare systems and improve health outcomes for communities nationwide.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Community Health Focus</h3>
                <p className="text-muted-foreground font-light">Strengthening healthcare delivery in communities across Nigeria</p>
              </div>

              <div className="text-center">
                <div className="bg-secondary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Healthcare Innovation</h3>
                <p className="text-muted-foreground font-light">Advancing modern healthcare solutions and best practices</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Sustainable Impact</h3>
                <p className="text-muted-foreground font-light">Creating lasting positive change in healthcare outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-foreground mb-4">Contact Us</h2>
              <p className="text-lg text-muted-foreground font-light">Get in touch with our team for support or inquiries</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Email</h3>
                <p className="text-muted-foreground font-light">info@ahnigeria.org</p>
              </div>

              <div className="text-center">
                <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Phone</h3>
                <p className="text-muted-foreground font-light">+234 (0) 123 456 7890</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Address</h3>
                <p className="text-muted-foreground font-light">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-foreground py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNI Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-muted-foreground">
                Empowering healthcare organizations across Nigeria through innovative solutions and community engagement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#opportunities" className="hover:text-primary transition-colors">Opportunities</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Portals</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button onClick={() => router.push('/auth/login')} className="hover:text-primary transition-colors">
                    Staff Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/vendor-portal')} className="hover:text-primary transition-colors">
                    Vendor Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/eoi')} className="hover:text-primary transition-colors">
                    Public Opportunities
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="mailto:support@ahnigeria.org" className="hover:text-primary transition-colors">Technical Support</a></li>
                <li><a href="mailto:vendor@ahnigeria.org" className="hover:text-primary transition-colors">Vendor Support</a></li>
                <li><a href="https://ahnigeria.org" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}