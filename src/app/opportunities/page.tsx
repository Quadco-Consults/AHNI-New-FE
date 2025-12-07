"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Building2,
  Users,
  FileText,
  Mail,
  ArrowLeft,
  ExternalLink,
  Clock,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { useGetPublicEois } from "@/features/procurement/controllers/eoiController";
import { useGetAllOpportunities } from "@/features/opportunities/controllers/opportunitiesController";

export default function OpportunitiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Fetch opportunities from both sources
  const { data: eoiData, isLoading: eoiLoading } = useGetPublicEois({
    page: 1,
    size: 50,
    search: searchTerm,
    enabled: true
  });

  const { data: unifiedData, isLoading: unifiedLoading } = useGetAllOpportunities({
    page: 1,
    size: 50,
    search: searchTerm
  });

  // Combine and transform data to match AHNI structure
  const allOpportunities = useMemo(() => {
    const procurementOpportunities = (eoiData?.data?.results || []).map((item: any) => ({
      id: item.id,
      title: item.title || item.opportunity_title,
      type: item.opportunity_type || "EOI",
      project: item.project || "Procurement",
      location: item.location || "Nigeria",
      postedDate: item.created_datetime || item.publication_date,
      deadline: item.closing_date || item.deadline,
      description: item.description || item.background,
      requirements: item.requirements || "",
      applicationEmail: "procurement@ahnigeria.org",
      category: "Procurement & EOI"
    }));

    const jobOpportunities = (unifiedData?.opportunities || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type === "HR_JOB" ? "Full Time" :
            item.type === "CONSULTANT" ? "Consultant" :
            item.type === "ADHOC" ? "Adhoc" :
            item.type === "FACILITATOR" ? "Facilitator" : "Contract",
      project: item.department || "AHNI Programs",
      location: Array.isArray(item.locations) ? item.locations.join(", ") : item.locations || "Nigeria",
      postedDate: item.created_datetime,
      deadline: item.end_date || item.commencement_date,
      description: item.background || item.description,
      requirements: item.qualifications_required || "",
      applicationEmail: item.type === "CONSULTANT" ? "consultants@ahnigeria.org" :
                       item.type === "FACILITATOR" ? "facilitators@ahnigeria.org" :
                       item.type === "ADHOC" ? "opportunities@ahnigeria.org" :
                       "careers@ahnigeria.org",
      category: item.type === "HR_JOB" ? "Employment" : "Contract & Consulting"
    }));

    return [...procurementOpportunities, ...jobOpportunities];
  }, [eoiData, unifiedData]);

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opportunity) => {
      const matchesSearch = searchTerm === "" ||
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" ||
        opportunity.category === categoryFilter;

      const matchesJobType = jobTypeFilter === "all" ||
        opportunity.type === jobTypeFilter;

      const matchesLocation = locationFilter === "all" ||
        opportunity.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesJobType && matchesLocation;
    });
  }, [allOpportunities, searchTerm, categoryFilter, jobTypeFilter, locationFilter]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline specified";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Deadline passed";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 7) return `Due in ${diffDays} days`;
    if (diffDays < 14) return "Due in 1 week";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently posted";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const isLoading = eoiLoading || unifiedLoading;

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
                className="text-primary font-medium"
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

        {/* Header Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-4">Career Opportunities</h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Join us in creating sustainable impact across Nigeria's healthcare landscape.
                Explore current openings for employment, consulting, procurement, and partnership opportunities.
              </p>
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Find Your Opportunity
                </CardTitle>
                <CardDescription>
                  Filter and search through our current openings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Keywords Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Contract & Consulting">Contract & Consulting</SelectItem>
                      <SelectItem value="Procurement & EOI">Procurement & EOI</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Job Type Filter */}
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Facilitator">Facilitator</SelectItem>
                      <SelectItem value="Adhoc">Adhoc</SelectItem>
                      <SelectItem value="EOI">EOI</SelectItem>
                      <SelectItem value="RFQ">RFQ</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Kano">Kano</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">
                {isLoading ? "Loading..." : `${filteredOpportunities.length} Opportunities Found`}
              </h2>
              <div className="text-sm text-muted-foreground">
                Updated regularly • Equal opportunity employer
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Loading opportunities...</span>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or check back later for new openings.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setJobTypeFilter("all");
                      setLocationFilter("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <Badge variant="secondary" className="text-xs">
                              {opportunity.project}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.type}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {opportunity.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Posted {getTimeAgo(opportunity.postedDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDate(opportunity.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-3">
                          {opportunity.description}
                        </p>
                      </div>

                      {expandedCard === opportunity.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Full Description</h4>
                            <p className="text-gray-700 whitespace-pre-line">{opportunity.description}</p>
                          </div>

                          {opportunity.requirements && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                              <p className="text-gray-700">{opportunity.requirements}</p>
                            </div>
                          )}

                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Application Instructions</h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-blue-900 mb-2">
                                To apply, please send your CV and cover letter to:
                              </p>
                              <div className="flex items-center gap-2 text-blue-900 font-medium">
                                <Mail className="h-4 w-4" />
                                {opportunity.applicationEmail}
                              </div>
                              <p className="text-xs text-blue-800 mt-2">
                                • Submit documents as a single MS Word file<br/>
                                • Include position title in subject line<br/>
                                • Only shortlisted candidates will be contacted<br/>
                                • AHNI does not charge candidates any fees
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                              <div className="text-xs text-yellow-800">
                                <strong>Important:</strong> AHNI has Zero Tolerance to Sexual Abuse and is committed to safeguarding and child protection.
                                We are an equal opportunity employer.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <Button
                          variant="ghost"
                          onClick={() => toggleCard(opportunity.id)}
                          className="text-primary hover:text-primary/80"
                        >
                          {expandedCard === opportunity.id ? "View Less" : "Read More"}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${opportunity.applicationEmail}?subject=Application for ${opportunity.title}`, '_blank')}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.share?.({
                              title: opportunity.title,
                              text: opportunity.description,
                              url: window.location.href
                            }) || navigator.clipboard.writeText(window.location.href)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-light mb-4">Don't See What You're Looking For?</h2>
            <p className="text-xl mb-8 font-light max-w-2xl mx-auto">
              We're always looking for talented individuals to join our mission of improving healthcare across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/contact')}
              >
                Contact Our HR Team
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.open('mailto:careers@ahnigeria.org', '_blank')}
              >
                Send Your CV
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
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>No. 30 Anthony Enahoro Street</li>
                <li>Utako District, Abuja, Nigeria</li>
                <li className="pt-2">
                  <a href="mailto:careers@ahnigeria.org" className="hover:text-primary transition-colors">
                    careers@ahnigeria.org
                  </a>
                </li>
                <li>
                  <a href="mailto:info@ahnigeria.org" className="hover:text-primary transition-colors">
                    info@ahnigeria.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Achieving Health Initiatives Nigeria (AHNI). All rights reserved. Equal Opportunity Employer.</p>
            <p className="mt-1">AHNI has Zero Tolerance to Sexual Abuse and is committed to safeguarding and child protection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}