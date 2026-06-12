"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Send,
  Clock,
  Globe,
  MessageSquare,
  Building,
  Users,
  HeartHandshake
} from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - could integrate with email service
    const mailtoLink = `mailto:AHNiOperations@ahnigeria.org?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.type}\n\nMessage:\n${formData.message}`)}`;
    window.open(mailtoLink, '_blank');
  };

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      primary: "AHNiOperations@ahnigeria.org",
      secondary: "careers@ahnigeria.org",
      description: "Operations and career opportunities"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone",
      primary: "+234.94615555",
      alt: "+234-09-4615555 / +234-09-461500",
      fax: "+234-09-4615511",
      secondary: "8:00am – 5:30pm Mon – Thu, 8:00am – 2:00pm Friday",
      description: "Direct contact during business hours"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Address",
      primary: "No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria",
      secondary: "CAC/NO/33391",
      description: "Our headquarters location"
    }
  ];

  const contactTypes = [
    {
      value: "general",
      label: "General Inquiry",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "General questions about AHNi"
    },
    {
      value: "partnership",
      label: "Partnership",
      icon: <HeartHandshake className="h-5 w-5" />,
      description: "Health technical assistance and collaboration opportunities"
    },
    {
      value: "career",
      label: "Career",
      icon: <Users className="h-5 w-5" />,
      description: "Job opportunities in health programming and applications"
    },
    {
      value: "vendor",
      label: "Vendor/Supplier",
      icon: <Building className="h-5 w-5" />,
      description: "Procurement and vendor inquiries for health programs"
    },
    {
      value: "technical",
      label: "Technical Support",
      icon: <Globe className="h-5 w-5" />,
      description: "System and portal technical issues"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-x-hidden">
      {/* Side decorative elements */}
      <div className="fixed left-0 top-1/4 w-32 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-r-full blur-sm -translate-x-16"></div>
      <div className="fixed right-0 top-1/3 w-32 h-48 bg-gradient-to-l from-secondary/10 to-transparent rounded-l-full blur-sm translate-x-16"></div>
      <div className="fixed left-0 bottom-1/4 w-24 h-40 bg-gradient-to-r from-muted/20 to-transparent rounded-r-full blur-sm -translate-x-12"></div>
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNi Logo"
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
                onClick={() => router.push('/')}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-lg px-6 py-3 h-auto"
              >
                Home
              </Button>
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
                className="text-primary bg-primary/10 font-semibold text-lg px-6 py-3 h-auto"
              >
                Contact
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2 border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all shadow-sm hover:shadow-md px-4 py-2.5"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Vendor Portal</span>
                <span className="sm:hidden">Vendor</span>
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all px-4 py-2.5"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Staff Portal</span>
                <span className="sm:hidden">Staff</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Back Button */}
        <div className="w-full px-6 lg:px-12 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-12 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/img/education.jpg"
              alt="Healthcare Education"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

          <div className="w-full relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">Contact Us</h1>
              <p className="text-xl md:text-3xl text-white/90 mb-12 leading-relaxed font-medium max-w-5xl mx-auto">
                Get in touch with our team for partnerships, opportunities, support, or any questions
                about our healthcare initiatives across Nigeria.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 px-6 lg:px-12 bg-background relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/10"></div>
          <div className="w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">How to Reach Us</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-4xl mx-auto leading-relaxed">
                Multiple ways to connect with our team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-none">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-border group hover:scale-105">
                  <CardHeader>
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-white shadow-xl group-hover:scale-110 transition-all duration-300">
                      {method.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-bold mb-3 text-lg">{method.primary}</p>
                    <p className="text-muted-foreground mb-4 font-medium">{method.secondary}</p>
                    <p className="text-muted-foreground font-medium leading-relaxed">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Creating Lasting Change Statistics */}
        <section className="py-20 px-6 lg:px-12 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/img/education.jpg"
              alt="Healthcare Education"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

          <div className="w-full relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">Creating Lasting Change</h2>
              <p className="text-xl md:text-2xl text-white/90 mb-16 leading-relaxed font-medium max-w-5xl mx-auto">
                Our comprehensive approach to healthcare development ensures that interventions are not only effective in the short term,
                but create sustainable systems and capacity for long-term health improvements.
              </p>

              <div className="grid md:grid-cols-3 gap-12 lg:gap-16 max-w-none">
                <div className="text-center group">
                  <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 backdrop-blur-sm">
                    <h3 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">10+</h3>
                    <p className="text-xl md:text-2xl text-white/90 font-semibold">Years of Experience</p>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 backdrop-blur-sm">
                    <h3 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">25+</h3>
                    <p className="text-xl md:text-2xl text-white/90 font-semibold">States Reached</p>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 backdrop-blur-sm">
                    <h3 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">100K+</h3>
                    <p className="text-xl md:text-2xl text-white/90 font-semibold">Lives Impacted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-foreground mb-4">Send Us a Message</h2>
                <p className="text-lg text-muted-foreground font-light">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-light">Get In Touch</CardTitle>
                    <CardDescription>
                      We'd love to hear from you. Choose the appropriate contact type and send us your message.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="type">Contact Type</Label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          {contactTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief subject of your message"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Your message here..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full font-medium">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-light text-foreground mb-6">Contact Types</h3>
                    <div className="space-y-4">
                      {contactTypes.map((type, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary mt-1">
                              {type.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{type.label}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="p-6 bg-primary/5">
                    <div className="flex items-start space-x-3 mb-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Business Hours</h4>
                        <p className="text-sm text-muted-foreground">Monday - Thursday: 8:00 AM - 5:30 PM</p>
                        <p className="text-sm text-muted-foreground">Friday: 8:00 AM - 2:00 PM</p>
                        <p className="text-sm text-muted-foreground">Saturday - Sunday: Closed</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We aim to respond to all inquiries within 24 hours during business days.
                      For urgent matters, please call our office directly.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">Ready to Work Together?</h2>
            <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
              Whether you're looking for opportunities, partnerships, or want to learn more about our work,
              we're here to help you make a positive impact on Nigeria's healthcare landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/opportunities')}
                className="font-medium"
              >
                View Opportunities
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/about')}
                className="font-medium border-white text-white hover:bg-white hover:text-primary"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </section>
      </main>

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
                <span className="font-semibold">AHNi</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Providing health technical assistance to Nigeria's public health sector through
                inclusive and innovative community-led programming since 2009.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><button onClick={() => router.push('/opportunities')} className="hover:text-primary transition-colors">Current Opportunities</button></li>
                <li><button onClick={() => router.push('/about')} className="hover:text-primary transition-colors">About AHNi</button></li>
                <li><button onClick={() => router.push('/focus-areas')} className="hover:text-primary transition-colors">Focus Areas</button></li>
                <li><button onClick={() => router.push('/contact')} className="hover:text-primary transition-colors">Contact</button></li>
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
                  <button onClick={() => router.push('/opportunities')} className="hover:text-primary transition-colors">
                    Job Opportunities
                  </button>
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
            <p>&copy; 2024 Achieving Health Nigeria initiative (AHNi). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}