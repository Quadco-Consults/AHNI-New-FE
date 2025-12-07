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
  FileText,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { getAccessToken } from "utils/auth";
import { usePublicEOIs, EOIUtils } from "@/features/vendor-portal/controllers/publicEOIController";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch public EOI data
  const { data: eoiData, isLoading: eoiLoading, error: eoiError } = usePublicEOIs();

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
    // Set loading to false immediately to allow page to render
    // EOI section will handle its own loading state
    setIsLoading(false);
  }, []);

  // Note: Removed auto-redirect to allow all users to see the landing page
  // Users can manually navigate to their respective dashboards using the navigation buttons

  // Carousel data - AHNI focused content
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

  // Static opportunities (diverse opportunity types)
  const staticOpportunities = [
    {
      title: "Community Health Facilitator Training",
      type: "Facilitator Advert",
      deadline: "2024-12-15",
      status: "Active",
      category: "Health Facilitation",
      location: "Lagos State",
      description: "Lead community health training sessions and capacity building programs",
      isEOI: false
    },
    {
      title: "Health Research Consultant",
      type: "Consultant Advert",
      deadline: "2024-12-18",
      status: "Active",
      category: "Research & Analysis",
      location: "Abuja, Nigeria",
      description: "Independent consultant for health policy research and strategic planning",
      isEOI: false
    },
    {
      title: "Emergency Response Support",
      type: "Adhoc Advert",
      deadline: "2024-12-25",
      status: "Active",
      category: "Emergency Support",
      location: "Multiple States",
      description: "Urgent support for emergency health response initiatives",
      isEOI: false
    },
    {
      title: "Community Health Innovation Grant",
      type: "Subgrant Advert",
      deadline: "2024-12-30",
      status: "Active",
      category: "Grant Funding",
      location: "National",
      description: "Funding opportunity for innovative community health projects",
      isEOI: false
    }
  ];

  // Combine static opportunities with real EOI data
  const currentOpportunities = [
    ...staticOpportunities,
    ...(eoiData?.results?.map(eoi => ({
      id: eoi.id,
      title: eoi.name,
      type: "Expression of Interest",
      deadline: EOIUtils.formatDate(eoi.closing_date),
      status: eoi.status,
      category: eoi.categories?.map(cat => cat.name).join(", ") || "Vendor Opportunity",
      location: "National",
      description: eoi.description,
      isEOI: true,
      eoiData: eoi,
      daysRemaining: EOIUtils.getDaysRemaining(eoi.closing_date),
      urgency: EOIUtils.getUrgencyLevel(EOIUtils.getDaysRemaining(eoi.closing_date))
    })) || [])
  ].slice(0, 6); // Limit to 6 total opportunities

  // Focus areas matching AHNI website
  const focusAreas = [
    {
      title: "Health System Strengthening",
      description: "Building robust healthcare infrastructure and capacity",
      icon: <Building2 className="h-8 w-8" />
    },
    {
      title: "Reproductive Health",
      description: "Improving maternal and child health outcomes",
      icon: <Users className="h-8 w-8" />
    },
    {
      title: "Education & Training",
      description: "Capacity building and knowledge transfer programs",
      icon: <FileText className="h-8 w-8" />
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AHNI Portal...</p>
        </div>
      </div>
    );
  }

  // Don't render the landing page for authenticated users - let the redirect happen
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
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
                  style={{ width: 'auto', height: '40px' }}
                />
                <div className="hidden md:block">
                  <h1 className="font-semibold text-lg text-foreground">AHNI Portal</h1>
                  <p className="text-sm text-muted-foreground">Achieving Health Initiatives Nigeria</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#opportunities" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Opportunities
              </a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                About
              </a>
              <a href="#focus-areas" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Focus Areas
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Vendor Portal</span>
                <span className="sm:hidden">Vendor</span>
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2 font-medium"
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

      {/* Mission Section */}
      <section className="py-16 px-4 bg-muted/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/img/login.jpeg"
            alt="AHNI Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-light text-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
                We enable socio-economic development in Nigeria by supporting health and research,
                with improved quality of life for people, especially vulnerable groups.
              </p>
              <p className="text-lg text-muted-foreground/80 font-light leading-relaxed">
                Through innovative healthcare solutions and strategic partnerships, we strengthen
                healthcare systems and drive evidence-based policies for sustainable development.
              </p>
            </div>

            {/* Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/img/login.jpeg"
                alt="AHNI Team and Mission"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Opportunities Section - Public Advertisements */}
      <section id="opportunities" className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-foreground mb-4">Current Opportunities</h2>
            <p className="text-lg text-muted-foreground font-light">
              Join us in creating sustainable impact - explore EOIs, RFQs, consultant, facilitator, adhoc, and subgrant opportunities
            </p>
          </div>

          {eoiLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading opportunities...</span>
            </div>
          ) : eoiError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Unable to load opportunities at the moment.</p>
                <p className="text-sm text-muted-foreground">Showing static opportunities below.</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {currentOpportunities.map((opportunity: any, index) => (
                <Card key={opportunity.id || index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${EOIUtils.getOpportunityTypeColor(opportunity.type)}`}
                      >
                        {opportunity.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={EOIUtils.getStatusBadgeVariant(opportunity.status)}
                          className="text-xs"
                        >
                          {opportunity.status}
                        </Badge>
                        {opportunity.isEOI && opportunity.daysRemaining <= 7 && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${EOIUtils.getUrgencyColor(opportunity.urgency)}`}
                          >
                            {opportunity.daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-medium leading-tight">{opportunity.title}</CardTitle>
                    <CardDescription className="font-light text-sm">
                      {opportunity.category} • {opportunity.location}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{opportunity.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-light">Deadline: {opportunity.deadline}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (opportunity.isEOI) {
                            // Create a public EOI details page or redirect to vendor portal
                            router.push(`/eoi/${opportunity.id}`);
                          } else {
                            // Handle different opportunity types appropriately
                            switch(opportunity.type) {
                              case "RFQ":
                                router.push('/vendor-portal/login'); // RFQs require vendor portal access
                                break;
                              case "Consultant Advert":
                                window.open('mailto:consultants@ahnigeria.org?subject=Consultant Application', '_blank');
                                break;
                              case "Facilitator Advert":
                                window.open('mailto:facilitators@ahnigeria.org?subject=Facilitator Application', '_blank');
                                break;
                              case "Adhoc Advert":
                                window.open('mailto:opportunities@ahnigeria.org?subject=Adhoc Opportunity Application', '_blank');
                                break;
                              case "Subgrant Advert":
                                window.open('mailto:grants@ahnigeria.org?subject=Subgrant Application', '_blank');
                                break;
                              default:
                                window.open('mailto:info@ahnigeria.org?subject=Opportunity Application', '_blank');
                            }
                          }
                        }}
                        className="font-medium text-sm"
                      >
{opportunity.isEOI ? 'View Details' : EOIUtils.getApplicationMethod(opportunity.type).buttonText}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2"
              >
                <Building2 className="h-5 w-5" />
                <span>EOI & RFQ Portal</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Staff Portal</span>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
              <p><strong>For Applications:</strong></p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Consultants: consultants@ahnigeria.org</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Facilitators: facilitators@ahnigeria.org</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Subgrants: grants@ahnigeria.org</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section id="focus-areas" className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-foreground mb-4">Our Focus Areas</h2>
            <p className="text-lg text-muted-foreground font-light">
              Strategic areas where we create sustainable impact across Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {focusAreas.map((area, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
                    {area.icon}
                  </div>
                  <CardTitle className="text-xl font-light">{area.title}</CardTitle>
                  <CardDescription className="font-light text-center">
                    {area.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-muted/20 via-background to-accent/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-foreground mb-6">About AHNI</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
              Achieving Health Initiatives Nigeria (AHNI) is dedicated to advancing healthcare delivery
              across Nigeria through innovative solutions and community engagement. We work to strengthen
              healthcare systems and improve health outcomes for communities nationwide.
            </p>

            <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Our Vision</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    A healthy and safe society where everyone thrives, with equitable access to
                    quality healthcare and opportunities for sustainable development.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Our Mission</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    To enable socio-economic development through health system strengthening,
                    research, and evidence-based interventions that improve quality of life.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Community Impact</h3>
                <p className="text-muted-foreground font-light">Strengthening healthcare delivery in communities across Nigeria</p>
              </div>

              <div className="text-center">
                <div className="bg-secondary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Innovation</h3>
                <p className="text-muted-foreground font-light">Advancing modern healthcare solutions and best practices</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-light text-xl mb-3 text-foreground">Sustainable Development</h3>
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
              <p className="text-lg text-muted-foreground font-light">Get in touch with our team for partnerships, opportunities, or support</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Email</h3>
                <p className="text-muted-foreground font-light">info@ahnigeria.org</p>
                <p className="text-muted-foreground font-light text-sm">careers@ahnigeria.org</p>
              </div>

              <div className="text-center">
                <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Phone</h3>
                <p className="text-muted-foreground font-light">+234 (0) 123 456 7890</p>
                <p className="text-muted-foreground font-light text-sm">Mon - Fri: 8:00 AM - 5:00 PM</p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-light text-lg mb-3 text-foreground">Address</h3>
                <p className="text-muted-foreground font-light">Lagos, Nigeria</p>
                <p className="text-muted-foreground font-light text-sm">CAC/NO/33391</p>
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
                <span className="font-semibold">AHNI</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering healthcare organizations across Nigeria through innovative solutions,
                strategic partnerships, and community engagement for sustainable development.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#opportunities" className="hover:text-primary transition-colors">Current Opportunities</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About AHNI</a></li>
                <li><a href="#focus-areas" className="hover:text-primary transition-colors">Focus Areas</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Portals</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <button onClick={() => router.push('/auth/login')} className="hover:text-primary transition-colors">
                    Staff Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/vendor-portal/login')} className="hover:text-primary transition-colors">
                    Vendor Portal
                  </button>
                </li>
                <li>
                  <a href="#opportunities" className="hover:text-primary transition-colors">
                    Job Opportunities
                  </a>
                </li>
                <li>
                  <a href="https://ahnigeria.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Main Website
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="mailto:support@ahnigeria.org" className="hover:text-primary transition-colors">Technical Support</a></li>
                <li><a href="mailto:vendor@ahnigeria.org" className="hover:text-primary transition-colors">Vendor Support</a></li>
                <li><a href="mailto:careers@ahnigeria.org" className="hover:text-primary transition-colors">Career Support</a></li>
                <li><a href="https://ahnigeria.org" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}