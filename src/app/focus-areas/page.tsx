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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-x-hidden">
      {/* Side decorative elements */}
      <div className="fixed left-0 top-1/4 w-32 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-r-full blur-sm -translate-x-16"></div>
      <div className="fixed right-0 top-1/3 w-32 h-48 bg-gradient-to-l from-secondary/10 to-transparent rounded-l-full blur-sm translate-x-16"></div>
      <div className="fixed left-0 bottom-1/4 w-24 h-40 bg-gradient-to-r from-muted/20 to-transparent rounded-r-full blur-sm -translate-x-12"></div>
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
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

            <nav className="flex items-center space-x-2">
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
                className="text-primary bg-primary/10 font-semibold text-lg px-6 py-3 h-auto"
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
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">Our Focus Areas</h1>
              <p className="text-xl md:text-3xl text-white/90 mb-12 leading-relaxed font-medium max-w-5xl mx-auto">
                Strategic areas where we create sustainable impact across Nigeria's healthcare landscape.
                Our comprehensive approach addresses systemic challenges while building local capacity for long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Focus Areas */}
        <section className="py-20 px-6 lg:px-12 bg-background relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/10"></div>
          <div className="w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">Core Focus Areas</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-4xl mx-auto leading-relaxed">
                Our primary areas of expertise and intervention
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-none">
              {focusAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 h-full border-2 border-border group hover:scale-105">
                  <CardHeader>
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-white shadow-xl group-hover:scale-110 transition-all duration-300">
                      {area.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{area.title}</CardTitle>
                    <CardDescription className="font-medium text-lg">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground font-medium mb-8 leading-relaxed text-lg">
                      {area.details}
                    </p>
                    <div className="text-left">
                      <h4 className="font-bold text-foreground mb-4 text-lg">Key Initiatives:</h4>
                      <ul className="space-y-3 text-muted-foreground">
                        {area.initiatives.map((initiative, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-3 text-lg font-bold">•</span>
                            <span className="font-medium">{initiative}</span>
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

        {/* Additional Focus Areas */}
        <section className="py-20 px-6 lg:px-12 bg-muted/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-primary/5 to-transparent rounded-l-full blur-2xl translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-secondary/5 to-transparent rounded-r-full blur-xl -translate-x-24"></div>

          <div className="w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">Additional Areas of Impact</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-5xl mx-auto leading-relaxed">
                Beyond our core focus areas, we work across a broad spectrum of health-related initiatives
                to create comprehensive and sustainable health system improvements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-none">
              {additionalFocusAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-border group hover:scale-105">
                  <CardHeader>
                    <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-white shadow-xl group-hover:scale-110 transition-all duration-300">
                      {area.icon}
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight">{area.title}</CardTitle>
                    <CardDescription className="font-medium text-lg">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                      {area.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statement */}
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
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-white">Creating Lasting Change</h2>
              <p className="text-xl md:text-2xl font-medium mb-12 leading-relaxed max-w-4xl mx-auto text-white/90">
                Our comprehensive approach to healthcare development ensures that interventions are not only effective
                in the short term, but create sustainable systems and capacity for long-term health improvements.
              </p>
              <div className="grid md:grid-cols-3 gap-12 mt-20">
                <div className="group">
                  <h3 className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-all duration-300 text-white">10+</h3>
                  <p className="text-xl font-medium text-white/90">Years of Experience</p>
                </div>
                <div className="group">
                  <h3 className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-all duration-300 text-white">25+</h3>
                  <p className="text-xl font-medium text-white/90">States Reached</p>
                </div>
                <div className="group">
                  <h3 className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-all duration-300 text-white">100K+</h3>
                  <p className="text-xl font-medium text-white/90">Lives Impacted</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 lg:px-12 bg-background relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/10"></div>
          <div className="w-full text-center relative">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">Get Involved</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium max-w-4xl mx-auto leading-relaxed">
              Whether you're a healthcare professional, researcher, or organization, there are opportunities
              to contribute to our mission of improving health outcomes across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/opportunities')}
                className="font-semibold text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Explore Opportunities
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="font-semibold text-lg px-8 py-4 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Partner With Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-foreground py-16 px-6 lg:px-12 border-t border-border">
        <div className="w-full">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16 max-w-none">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/imgs/logo.png"
                  alt="AHNI Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="font-bold text-xl">AHNI</span>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Empowering healthcare organizations across Nigeria through innovative solutions,
                strategic partnerships, and community engagement for sustainable development.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><button onClick={() => router.push('/opportunities')} className="hover:text-primary transition-colors font-medium">Current Opportunities</button></li>
                <li><button onClick={() => router.push('/about')} className="hover:text-primary transition-colors font-medium">About AHNI</button></li>
                <li><button onClick={() => router.push('/focus-areas')} className="hover:text-primary transition-colors font-medium">Focus Areas</button></li>
                <li><button onClick={() => router.push('/contact')} className="hover:text-primary transition-colors font-medium">Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Resources</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <button onClick={() => router.push('/opportunities')} className="hover:text-primary transition-colors font-medium">
                    Job Opportunities
                  </button>
                </li>
                <li>
                  <a href="https://ahnigeria.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                    Main Website
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="mailto:support@ahnigeria.org" className="hover:text-primary transition-colors font-medium">Technical Support</a></li>
                <li><a href="mailto:vendor@ahnigeria.org" className="hover:text-primary transition-colors font-medium">Vendor Support</a></li>
                <li><a href="mailto:careers@ahnigeria.org" className="hover:text-primary transition-colors font-medium">Career Support</a></li>
                <li><a href="https://ahnigeria.org" className="hover:text-primary transition-colors font-medium">Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted mt-12 pt-8 text-center text-muted-foreground">
            <p className="font-medium">&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved. CAC/NO/33391</p>
          </div>
        </div>
      </footer>
    </div>
  );
}