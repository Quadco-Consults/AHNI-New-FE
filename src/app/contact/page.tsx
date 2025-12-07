"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
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
    const mailtoLink = `mailto:info@ahnigeria.org?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.type}\n\nMessage:\n${formData.message}`)}`;
    window.open(mailtoLink, '_blank');
  };

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      primary: "info@ahnigeria.org",
      secondary: "careers@ahnigeria.org",
      description: "General inquiries and career opportunities"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone",
      primary: "+234 (0) 123 456 7890",
      secondary: "Mon - Fri: 8:00 AM - 5:00 PM",
      description: "Direct contact during business hours"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Address",
      primary: "Lagos, Nigeria",
      secondary: "CAC/NO/33391",
      description: "Our headquarters location"
    }
  ];

  const contactTypes = [
    {
      value: "general",
      label: "General Inquiry",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "General questions about AHNI"
    },
    {
      value: "partnership",
      label: "Partnership",
      icon: <HeartHandshake className="h-5 w-5" />,
      description: "Collaboration opportunities"
    },
    {
      value: "career",
      label: "Career",
      icon: <Users className="h-5 w-5" />,
      description: "Job opportunities and applications"
    },
    {
      value: "vendor",
      label: "Vendor/Supplier",
      icon: <Building className="h-5 w-5" />,
      description: "Procurement and vendor inquiries"
    },
    {
      value: "technical",
      label: "Technical Support",
      icon: <Globe className="h-5 w-5" />,
      description: "System and technical issues"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/imgs/logo.png"
                alt="AHNI Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <h1 className="font-bold text-xl text-foreground">AHNI</h1>
                <p className="text-sm text-muted-foreground">Achieving Health Initiatives Nigeria</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/opportunities')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Opportunities
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/about')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/focus-areas')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Focus Areas
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/contact')}
                className="text-primary font-medium"
              >
                Contact
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="font-medium"
              >
                Staff Portal
              </Button>
              <Button
                onClick={() => router.push('/vendor-portal/login')}
                className="font-medium"
              >
                Vendor Portal
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-light text-foreground mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Get in touch with our team for partnerships, opportunities, support, or any questions
                about our healthcare initiatives across Nigeria.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-foreground mb-4">How to Reach Us</h2>
              <p className="text-lg text-muted-foreground font-light">
                Multiple ways to connect with our team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl font-light">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium mb-2">{method.primary}</p>
                    <p className="text-muted-foreground text-sm mb-3">{method.secondary}</p>
                    <p className="text-muted-foreground font-light text-sm">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
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
                        <p className="text-sm text-muted-foreground">Monday - Friday: 8:00 AM - 5:00 PM</p>
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
                <li><button onClick={() => router.push('/opportunities')} className="hover:text-primary transition-colors">Current Opportunities</button></li>
                <li><button onClick={() => router.push('/about')} className="hover:text-primary transition-colors">About AHNI</button></li>
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
            <p>&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}