"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  BarChart,
  ArrowLeft,
  Building2,
  Users,
  HeartHandshake
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

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
                className="text-primary bg-primary/10 font-semibold text-lg px-6 py-3 h-auto"
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

        {/* Hero About Section */}
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
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">About AHNI</h1>
              <p className="text-xl md:text-3xl text-white/90 mb-12 leading-relaxed font-medium max-w-5xl mx-auto">
                Achieving Health Initiatives Nigeria (AHNI) is dedicated to advancing healthcare delivery
                across Nigeria through innovative solutions and community engagement. We work to strengthen
                healthcare systems and improve health outcomes for communities nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 px-6 lg:px-12 bg-background relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/10"></div>
          <div className="w-full relative">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl border-2 border-border mb-20">
                <div className="grid lg:grid-cols-2 gap-12 text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Globe className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground tracking-tight">Our Vision</h2>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed text-xl">
                      A healthy and safe society where everyone thrives, with equitable access to
                      quality healthcare and opportunities for sustainable development.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-secondary/20 rounded-full">
                        <Shield className="h-8 w-8 text-secondary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground tracking-tight">Our Mission</h2>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed text-xl">
                      To enable socio-economic development through health system strengthening,
                      research, and evidence-based interventions that improve quality of life.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Values Grid */}
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <Globe className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-bold text-3xl mb-6 text-foreground tracking-tight">Community Impact</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                    Strengthening healthcare delivery in communities across Nigeria through targeted interventions and sustainable programs.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-bold text-3xl mb-6 text-foreground tracking-tight">Innovation</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                    Advancing modern healthcare solutions and best practices through research, technology, and evidence-based approaches.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <BarChart className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-bold text-3xl mb-6 text-foreground tracking-tight">Sustainable Development</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                    Creating lasting positive change in healthcare outcomes through strategic partnerships and capacity building.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="py-20 px-6 lg:px-12 bg-muted/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-primary/5 to-transparent rounded-l-full blur-2xl translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-secondary/5 to-transparent rounded-r-full blur-xl -translate-x-24"></div>

          <div className="w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">Our Approach</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-5xl mx-auto leading-relaxed">
                We believe in a comprehensive approach to healthcare development that addresses systemic challenges while building local capacity for sustainable impact.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-none">
              <div className="bg-white rounded-2xl p-10 lg:p-12 shadow-2xl text-center border-2 border-border group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">System Strengthening</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  Building robust healthcare infrastructure and institutional capacity to support long-term health outcomes.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-10 lg:p-12 shadow-2xl text-center border-2 border-border group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">Community Engagement</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  Working directly with communities to understand needs and implement culturally appropriate health solutions.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-10 lg:p-12 shadow-2xl text-center border-2 border-border group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-all duration-300">
                  <HeartHandshake className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">Strategic Partnerships</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  Collaborating with government, NGOs, and international partners to maximize impact and resource efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
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

          <div className="w-full text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-white">Join Our Mission</h2>
            <p className="text-xl md:text-2xl mb-12 font-medium max-w-4xl mx-auto leading-relaxed text-white/90">
              Whether you're a healthcare professional, researcher, or organization looking to make a difference, there are many ways to get involved with AHNI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/opportunities')}
                className="font-semibold text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                View Opportunities
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="font-semibold text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get In Touch
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
              <h3 className="font-bold text-lg mb-6">Portals</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <button onClick={() => router.push('/auth/login')} className="hover:text-primary transition-colors font-medium">
                    Staff Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/vendor-portal/login')} className="hover:text-primary transition-colors font-medium">
                    Vendor Portal
                  </button>
                </li>
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