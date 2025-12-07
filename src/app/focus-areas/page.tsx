"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  FileText,
  ArrowLeft,
  Heart,
  Stethoscope,
  BookOpen,
  TrendingUp,
  Shield,
  Target
} from "lucide-react";
import Image from "next/image";

export default function FocusAreasPage() {
  const router = useRouter();

  const focusAreas = [
    {
      title: "Health System Strengthening",
      description: "Building robust healthcare infrastructure and capacity",
      icon: <Building2 className="h-8 w-8" />,
      details: "We work to strengthen healthcare systems through infrastructure development, capacity building, policy support, and institutional strengthening initiatives.",
      initiatives: [
        "Healthcare infrastructure development",
        "Health workforce capacity building",
        "Health information systems",
        "Quality improvement programs"
      ]
    },
    {
      title: "Reproductive Health",
      description: "Improving maternal and child health outcomes",
      icon: <Users className="h-8 w-8" />,
      details: "Our reproductive health programs focus on reducing maternal and child mortality through improved access to quality care and evidence-based interventions.",
      initiatives: [
        "Maternal and child health programs",
        "Family planning services",
        "Skilled birth attendance",
        "Emergency obstetric care"
      ]
    },
    {
      title: "Education & Training",
      description: "Capacity building and knowledge transfer programs",
      icon: <FileText className="h-8 w-8" />,
      details: "We provide comprehensive training and education programs to build local capacity and ensure sustainable healthcare delivery.",
      initiatives: [
        "Healthcare professional training",
        "Community health education",
        "Leadership development",
        "Technical skill enhancement"
      ]
    }
  ];

  const additionalFocusAreas = [
    {
      title: "Disease Prevention & Control",
      description: "Preventing and managing communicable and non-communicable diseases",
      icon: <Shield className="h-10 w-10" />,
      details: "Comprehensive disease prevention and control programs targeting both communicable and non-communicable diseases."
    },
    {
      title: "Primary Healthcare",
      description: "Strengthening primary healthcare delivery systems",
      icon: <Stethoscope className="h-10 w-10" />,
      details: "Building and supporting primary healthcare systems to ensure accessible, quality care at the community level."
    },
    {
      title: "Health Research",
      description: "Evidence-based research for policy and program development",
      icon: <BookOpen className="h-10 w-10" />,
      details: "Conducting and supporting health research to generate evidence for effective health policies and programs."
    },
    {
      title: "Community Health",
      description: "Community-based health promotion and disease prevention",
      icon: <Heart className="h-10 w-10" />,
      details: "Working with communities to promote health, prevent disease, and improve overall health outcomes."
    },
    {
      title: "Health Equity",
      description: "Addressing health disparities and promoting equitable access",
      icon: <Target className="h-10 w-10" />,
      details: "Ensuring equitable access to healthcare services and addressing social determinants of health."
    },
    {
      title: "Health Innovation",
      description: "Advancing innovative healthcare solutions and technologies",
      icon: <TrendingUp className="h-10 w-10" />,
      details: "Promoting and implementing innovative healthcare technologies and service delivery models."
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
                className="text-primary font-medium"
              >
                Focus Areas
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/contact')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
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
              <h1 className="text-5xl font-light text-foreground mb-6">Our Focus Areas</h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Strategic areas where we create sustainable impact across Nigeria's healthcare landscape.
                Our comprehensive approach addresses systemic challenges while building local capacity for long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Focus Areas */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-foreground mb-4">Core Focus Areas</h2>
              <p className="text-lg text-muted-foreground font-light">
                Our primary areas of expertise and intervention
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {focusAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
                      {area.icon}
                    </div>
                    <CardTitle className="text-xl font-light">{area.title}</CardTitle>
                    <CardDescription className="font-light text-center">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-light text-sm mb-6 leading-relaxed">
                      {area.details}
                    </p>
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground mb-3">Key Initiatives:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {area.initiatives.map((initiative, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {initiative}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Focus Areas */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-foreground mb-4">Additional Areas of Impact</h2>
              <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto">
                Beyond our core focus areas, we work across a broad spectrum of health-related initiatives
                to create comprehensive and sustainable health system improvements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {additionalFocusAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="bg-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-secondary">
                      {area.icon}
                    </div>
                    <CardTitle className="text-lg font-light">{area.title}</CardTitle>
                    <CardDescription className="font-light text-center text-sm">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-light text-sm leading-relaxed">
                      {area.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="py-20 px-4 bg-primary text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-light mb-6">Creating Lasting Change</h2>
              <p className="text-xl font-light mb-8 leading-relaxed">
                Our comprehensive approach to healthcare development ensures that interventions are not only effective
                in the short term, but create sustainable systems and capacity for long-term health improvements.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div>
                  <h3 className="text-3xl font-bold mb-2">10+</h3>
                  <p className="text-lg font-light">Years of Experience</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">25+</h3>
                  <p className="text-lg font-light">States Reached</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">100K+</h3>
                  <p className="text-lg font-light">Lives Impacted</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-light text-foreground mb-6">Get Involved</h2>
            <p className="text-xl text-muted-foreground mb-8 font-light max-w-2xl mx-auto">
              Whether you're a healthcare professional, researcher, or organization, there are opportunities
              to contribute to our mission of improving health outcomes across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/opportunities')}
                className="font-medium"
              >
                Explore Opportunities
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="font-medium"
              >
                Partner With Us
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