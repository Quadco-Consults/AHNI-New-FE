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
  AlertCircle,
  ArrowRight
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

  // Helper function to determine opportunity detail route
  const getDetailRoute = (opportunity: any) => {
    // Map opportunity types to their detail routes
    // Handle both backend types and transformed frontend types
    const type = opportunity.type || opportunity.opportunity_type;

    switch (type) {
      case 'Full Time':
      case 'Job':
      case 'HR_JOB':
      case 'JOB':
        return `/jobs/${opportunity.id}`;
      case 'Consultant':
      case 'CONSULTANT':
        return `/consultant-jobs/${opportunity.id}`;
      case 'Facilitator':
      case 'FACILITATOR':
        return `/facilitator-jobs/${opportunity.id}`;
      case 'Adhoc':
      case 'ADHOC':
        return `/adhoc-jobs/${opportunity.id}`;
      case 'RFQ':
        return `/rfq/${opportunity.id}`;
      case 'RFP':
        return `/rfp/${opportunity.id}`;
      case 'EOI':
      default:
        return `/eoi/${opportunity.id}`;
    }
  };

  const isLoading = eoiLoading || unifiedLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-x-hidden">
      {/* Side decorative elements */}
      <div className="fixed left-0 top-1/4 w-32 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-r-full blur-sm -translate-x-16"></div>
      <div className="fixed right-0 top-1/3 w-32 h-48 bg-gradient-to-l from-secondary/10 to-transparent rounded-l-full blur-sm translate-x-16"></div>
      <div className="fixed left-0 bottom-1/4 w-24 h-40 bg-gradient-to-r from-muted/20 to-transparent rounded-r-full blur-sm -translate-x-12"></div>
      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-3">
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
                <h1 className="font-bold text-xl text-foreground tracking-tight">AHNI Portal</h1>
                <p className="text-sm text-muted-foreground font-medium">Achieving Health Initiatives Nigeria</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/opportunities')}
                className="text-primary bg-primary/10 font-semibold px-4 py-2"
              >
                Opportunities
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/about')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/focus-areas')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Focus Areas
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/contact')}
                className="text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all font-semibold px-4 py-2"
              >
                Contact
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/vendor-portal/login')}
                className="flex items-center space-x-2 border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Vendor Portal</span>
                <span className="sm:hidden">Vendor</span>
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex items-center space-x-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
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

        {/* Header Section */}
        <section className="py-16 px-6 lg:px-12 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
          <div className="w-full max-w-none">
            <div className="text-center max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">Career Opportunities</h1>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-5xl mx-auto">
                Join us in creating sustainable impact across Nigeria's healthcare landscape.
                Explore current openings for employment, consulting, procurement, and partnership opportunities.
              </p>
              <div className="text-lg text-primary-foreground/90 font-medium">
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5" />
                  No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunity Types Cards */}
        <section className="py-16 px-6 lg:px-12 bg-background relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <div className="w-full relative">
            <div className="text-center mb-12 max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Opportunity Categories</h2>
              <p className="text-xl text-muted-foreground font-medium">
                Discover various ways to contribute to Nigeria's healthcare development through our diverse opportunity types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-none mx-auto px-4">
              {/* Consultant Opportunities */}
              <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    Consultant Positions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6 font-medium">
                    Expert advisory roles for healthcare professionals with specialized knowledge and experience in various domains.
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="default"
                    className="group-hover:bg-blue-500 group-hover:text-white transition-all font-semibold shadow-sm hover:shadow-md w-full"
                    onClick={() => {
                      setCategoryFilter("Contract & Consulting");
                      setJobTypeFilter("Consultant");
                    }}
                  >
                    View Consultant Jobs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Job Advertisements */}
              <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    Job Advertisements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6 font-medium">
                    Full-time employment opportunities across various departments including program management, admin, and field operations.
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="default"
                    className="group-hover:bg-green-500 group-hover:text-white transition-all font-semibold shadow-sm hover:shadow-md w-full"
                    onClick={() => {
                      setCategoryFilter("Employment");
                      setJobTypeFilter("Full Time");
                    }}
                  >
                    View Job Openings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Adhoc Opportunities */}
              <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    Adhoc Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6 font-medium">
                    Short-term project-based opportunities for specific tasks, research assignments, and temporary support roles.
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="default"
                    className="group-hover:bg-purple-500 group-hover:text-white transition-all font-semibold shadow-sm hover:shadow-md w-full"
                    onClick={() => {
                      setCategoryFilter("Contract & Consulting");
                      setJobTypeFilter("Adhoc");
                    }}
                  >
                    View Adhoc Work
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* EOI Opportunities */}
              <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-border hover:border-primary/20 bg-white">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    Expression of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6 font-medium">
                    Partnership opportunities, procurement processes, and vendor engagement for organizations and service providers.
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="default"
                    className="group-hover:bg-orange-500 group-hover:text-white transition-all font-semibold shadow-sm hover:shadow-md w-full"
                    onClick={() => {
                      setCategoryFilter("Procurement & EOI");
                      setJobTypeFilter("EOI");
                    }}
                  >
                    View EOI Opportunities
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-12 px-6 lg:px-12 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 relative">
          <div className="w-full">
            <div className="max-w-none mx-auto">
            <Card className="shadow-lg border-2 border-border hover:border-primary/20 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <Filter className="h-6 w-6 text-primary" />
                  Find Your Opportunity
                </CardTitle>
                <CardDescription className="text-lg font-medium">
                  Filter and search through our current openings to find the perfect match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Keywords Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search keywords, titles, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-base font-medium border-2 border-border focus:border-primary"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 text-base font-medium border-2 border-border focus:border-primary">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="font-medium">All Categories</SelectItem>
                      <SelectItem value="Employment" className="font-medium">Employment</SelectItem>
                      <SelectItem value="Contract & Consulting" className="font-medium">Contract & Consulting</SelectItem>
                      <SelectItem value="Procurement & EOI" className="font-medium">Procurement & EOI</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Job Type Filter */}
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger className="h-12 text-base font-medium border-2 border-border focus:border-primary">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="font-medium">All Types</SelectItem>
                      <SelectItem value="Full Time" className="font-medium">Full Time Jobs</SelectItem>
                      <SelectItem value="Consultant" className="font-medium">Consultant Roles</SelectItem>
                      <SelectItem value="Facilitator" className="font-medium">Facilitator Positions</SelectItem>
                      <SelectItem value="Adhoc" className="font-medium">Adhoc Assignments</SelectItem>
                      <SelectItem value="EOI" className="font-medium">Expression of Interest</SelectItem>
                      <SelectItem value="RFQ" className="font-medium">Request for Quote</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="h-12 text-base font-medium border-2 border-border focus:border-primary">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="font-medium">All Locations</SelectItem>
                      <SelectItem value="Abuja" className="font-medium">Abuja, FCT</SelectItem>
                      <SelectItem value="Lagos" className="font-medium">Lagos State</SelectItem>
                      <SelectItem value="Kano" className="font-medium">Kano State</SelectItem>
                      <SelectItem value="Nigeria" className="font-medium">Nigeria (Multiple)</SelectItem>
                      <SelectItem value="Remote" className="font-medium">Remote Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || categoryFilter !== "all" || jobTypeFilter !== "all" || locationFilter !== "all") && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-foreground">Active Filters:</span>
                      {searchTerm && (
                        <Badge variant="secondary" className="font-medium">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {categoryFilter !== "all" && (
                        <Badge variant="secondary" className="font-medium">
                          Category: {categoryFilter}
                        </Badge>
                      )}
                      {jobTypeFilter !== "all" && (
                        <Badge variant="secondary" className="font-medium">
                          Type: {jobTypeFilter}
                        </Badge>
                      )}
                      {locationFilter !== "all" && (
                        <Badge variant="secondary" className="font-medium">
                          Location: {locationFilter}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("all");
                        setJobTypeFilter("all");
                        setLocationFilter("all");
                      }}
                      className="text-primary hover:bg-primary hover:text-white font-semibold"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-6 lg:px-12 bg-background relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent"></div>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="w-full relative">
            <div className="flex gap-8 max-w-none">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                      {isLoading ? "Loading..." : `${filteredOpportunities.length} Opportunities Found`}
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium">
                      Updated regularly • Equal opportunity employer • Zero tolerance for sexual abuse
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <Badge variant="outline" className="font-semibold text-primary border-primary/50">
                      <Clock className="h-3 w-3 mr-1" />
                      Live Opportunities
                    </Badge>
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
              <div className="space-y-8">
                {filteredOpportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary/20 bg-white"
                    onClick={() => router.push(getDetailRoute(opportunity))}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="font-semibold text-sm px-3 py-1">
                                {opportunity.project}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`font-semibold text-sm px-3 py-1 ${
                                  opportunity.type === 'Consultant' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                  opportunity.type === 'Full Time' ? 'border-green-500 text-green-700 bg-green-50' :
                                  opportunity.type === 'Adhoc' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                                  opportunity.type === 'EOI' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                  'border-gray-500 text-gray-700 bg-gray-50'
                                }`}
                              >
                                {opportunity.type}
                              </Badge>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                            {opportunity.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-6 text-base text-muted-foreground mb-4">
                            <span className="flex items-center gap-2 font-medium">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <Calendar className="h-4 w-4" />
                              Posted {getTimeAgo(opportunity.postedDate)}
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <Clock className="h-4 w-4" />
                              {formatDate(opportunity.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-foreground/80 line-clamp-3 text-lg leading-relaxed">
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

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(opportunity.id);
                          }}
                          className="text-primary hover:text-primary/80 font-semibold hover:bg-primary/5 px-4 py-2"
                        >
                          {expandedCard === opportunity.id ? "View Less" : "Read More Details"}
                        </Button>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(getDetailRoute(opportunity));
                            }}
                            className="font-semibold border-2 border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${opportunity.applicationEmail}?subject=Application for ${opportunity.title}`, '_blank');
                            }}
                            className="font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
              </div>

              {/* Sidebar with Quick Info */}
              <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  {/* Quick Stats */}
                  <Card className="border-2 border-border bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Opportunities</span>
                        <Badge variant="secondary" className="font-bold">
                          {allOpportunities.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Full-Time Jobs</span>
                        <Badge variant="outline" className="font-bold">
                          {allOpportunities.filter(o => o.type === 'Full Time').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Consultant Roles</span>
                        <Badge variant="outline" className="font-bold">
                          {allOpportunities.filter(o => o.type === 'Consultant').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Adhoc Work</span>
                        <Badge variant="outline" className="font-bold">
                          {allOpportunities.filter(o => o.type === 'Adhoc').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">EOI Opportunities</span>
                        <Badge variant="outline" className="font-bold">
                          {allOpportunities.filter(o => o.type === 'EOI').length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Application Tips */}
                  <Card className="border-2 border-border bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        Application Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Tailor your application</strong> to each specific role and requirements
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Submit documents</strong> as a single MS Word file when possible
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Include position title</strong> in your email subject line
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Apply early</strong> - we review applications on a rolling basis
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card className="border-2 border-border bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Need Help?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm space-y-3">
                        <div>
                          <strong className="text-foreground">General Inquiries</strong>
                          <p className="text-muted-foreground">careers@ahnigeria.org</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Technical Support</strong>
                          <p className="text-muted-foreground">support@ahnigeria.org</p>
                        </div>
                        <div>
                          <strong className="text-foreground">Partnership Opportunities</strong>
                          <p className="text-muted-foreground">partnerships@ahnigeria.org</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/95 to-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Don't See What You're Looking For?</h2>
            <p className="text-xl md:text-2xl mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
              We're always looking for talented individuals to join our mission of improving healthcare across Nigeria.
              Your expertise could be exactly what we need for our next breakthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/contact')}
                className="font-bold text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              >
                Contact Our HR Team
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open('mailto:careers@ahnigeria.org', '_blank')}
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Your CV
              </Button>
            </div>
            <div className="mt-8 text-lg text-white/90 font-medium">
              <p>careers@ahnigeria.org • Equal Opportunity Employer</p>
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