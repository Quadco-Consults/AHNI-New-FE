"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  BarChart3,
  ArrowLeft,
  Building2,
  Users,
  HeartHandshake
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

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
                className="text-primary font-medium"
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

        {/* About Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-light text-foreground mb-6">About AHNI</h1>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-light">
                Achieving Health Initiatives Nigeria (AHNI) is dedicated to advancing healthcare delivery
                across Nigeria through innovative solutions and community engagement. We work to strengthen
                healthcare systems and improve health outcomes for communities nationwide.
              </p>

              <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Our Vision</h2>
                    <p className="text-muted-foreground font-light leading-relaxed text-lg">
                      A healthy and safe society where everyone thrives, with equitable access to
                      quality healthcare and opportunities for sustainable development.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
                    <p className="text-muted-foreground font-light leading-relaxed text-lg">
                      To enable socio-economic development through health system strengthening,
                      research, and evidence-based interventions that improve quality of life.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Globe className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-light text-2xl mb-4 text-foreground">Community Impact</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Strengthening healthcare delivery in communities across Nigeria through targeted interventions and sustainable programs.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-secondary/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Shield className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="font-light text-2xl mb-4 text-foreground">Innovation</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Advancing modern healthcare solutions and best practices through research, technology, and evidence-based approaches.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-light text-2xl mb-4 text-foreground">Sustainable Development</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Creating lasting positive change in healthcare outcomes through strategic partnerships and capacity building.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light text-foreground mb-6">Our Approach</h2>
                <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto">
                  We believe in a comprehensive approach to healthcare development that addresses systemic challenges while building local capacity for sustainable impact.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">System Strengthening</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Building robust healthcare infrastructure and institutional capacity to support long-term health outcomes.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                  <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Community Engagement</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Working directly with communities to understand needs and implement culturally appropriate health solutions.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <HeartHandshake className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Strategic Partnerships</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Collaborating with government, NGOs, and international partners to maximize impact and resource efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 font-light max-w-2xl mx-auto">
              Whether you're a healthcare professional, researcher, or organization looking to make a difference, there are many ways to get involved with AHNI.
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
                onClick={() => router.push('/contact')}
                className="font-medium border-white text-white hover:bg-white hover:text-primary"
              >
                Get In Touch
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