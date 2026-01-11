"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  HelpCircle,
  MessageSquare,
  Book,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Users,
  Lightbulb,
  Heart,
  Star,
  Send,
  Calendar,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorSupportPage() {
  const router = useRouter();
  const { data: vendorProfile, isLoading } = useVendorProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    message: "",
    attachments: []
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // FAQ data
  const faqs = [
    {
      id: 1,
      category: "Account & Profile",
      question: "How do I update my company information?",
      answer: "You can update your company information by going to Settings > Account tab. Note that some information like company name and registration number require contacting support to change."
    },
    {
      id: 2,
      category: "RFQ & Bidding",
      question: "Why can't I see any RFQs?",
      answer: "RFQs are filtered based on your approved categories. If you don't see any RFQs, it might be because: 1) No RFQs match your approved categories, 2) Your account is not yet approved, or 3) All current RFQs have closed."
    },
    {
      id: 3,
      category: "RFQ & Bidding",
      question: "How do I submit a bid for an RFQ?",
      answer: "Navigate to the RFQ details page and click 'Submit Bid'. You'll need to fill in your pricing, technical specifications, and upload required documents. Make sure to submit before the closing date."
    },
    {
      id: 4,
      category: "Account & Profile",
      question: "How long does vendor approval take?",
      answer: "Vendor approval typically takes 5-10 business days after submitting all required documentation. You'll receive email notifications about your application status."
    },
    {
      id: 5,
      category: "Categories & Prequalification",
      question: "How do I apply for additional categories?",
      answer: "Go to Profile > Categories to view your current categories and apply for new ones. Each category requires specific documentation and qualifications."
    },
    {
      id: 6,
      category: "Orders & Payments",
      question: "When will I receive payment for completed orders?",
      answer: "Payment terms are specified in each purchase order. Typically, payments are processed within 30-45 days after delivery acceptance and invoice submission."
    },
    {
      id: 7,
      category: "Technical Support",
      question: "I'm having trouble uploading documents",
      answer: "Ensure your documents are in PDF, JPG, or PNG format and under 5MB each. If you continue to have issues, try clearing your browser cache or using a different browser."
    },
    {
      id: 8,
      category: "Categories & Prequalification",
      question: "What documents do I need for prequalification?",
      answer: "Required documents include: Company registration certificate, Tax clearance certificate, Audited financial statements, Professional certifications, and category-specific qualifications."
    }
  ];

  // Contact options
  const contactOptions = [
    {
      type: "email",
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "vendors@ahni.org",
      icon: Mail,
      responseTime: "Within 24 hours",
      bestFor: "General inquiries, account issues"
    },
    {
      type: "phone",
      title: "Phone Support",
      description: "Speak with our support team",
      contact: "+234 800 AHNI (2464)",
      icon: Phone,
      responseTime: "Mon-Fri, 8AM-5PM",
      bestFor: "Urgent issues, technical problems"
    },
    {
      type: "portal",
      title: "Support Portal",
      description: "Submit a detailed support request",
      contact: "Built-in form below",
      icon: MessageSquare,
      responseTime: "Within 12 hours",
      bestFor: "Complex issues, feature requests"
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) {
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('sent');
      setContactForm({
        subject: "",
        category: "",
        priority: "medium",
        message: "",
        attachments: []
      });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading support center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Get help with your vendor portal experience. Find answers to common questions or contact our support team.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">&lt; 24hrs</div>
            <div className="text-xs text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-xs text-gray-600">Issue Resolution</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">4.9/5</div>
            <div className="text-xs text-gray-600">Support Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-xs text-gray-600">System Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Alerts */}
      {submitStatus === 'sent' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your support request has been submitted successfully. We'll get back to you within 24 hours.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please fill in all required fields before submitting your request.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Book className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="status">
            <Zap className="h-4 w-4 mr-2" />
            System Status
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {["All", "Account & Profile", "RFQ & Bidding", "Categories & Prequalification", "Orders & Payments", "Technical Support"].map((category) => (
              <Button
                key={category}
                variant={searchQuery === "" && category === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchQuery(category === "All" ? "" : category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                      <HelpCircle className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0 ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse all categories
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contactOptions.map((option) => (
              <Card key={option.type}>
                <CardContent className="p-6 text-center">
                  <option.icon className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded mb-3">
                    {option.contact}
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.responseTime}
                    </div>
                    <div>{option.bestFor}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
              <CardDescription>
                Describe your issue in detail and we'll get back to you soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={contactForm.category}
                    onValueChange={(value) => setContactForm(prev => ({
                      ...prev,
                      category: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account & Profile</SelectItem>
                      <SelectItem value="rfq">RFQ & Bidding</SelectItem>
                      <SelectItem value="categories">Categories & Prequalification</SelectItem>
                      <SelectItem value="orders">Orders & Payments</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={contactForm.priority}
                    onValueChange={(value) => setContactForm(prev => ({
                      ...prev,
                      priority: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General question</SelectItem>
                      <SelectItem value="medium">Medium - Standard issue</SelectItem>
                      <SelectItem value="high">High - Urgent problem</SelectItem>
                      <SelectItem value="critical">Critical - System down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Company</Label>
                  <Input
                    value={vendorProfile?.company_name || 'Not available'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Please describe your issue in detail, including any error messages, steps you've taken, and when the problem occurs..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleContactSubmit}
                  disabled={submitStatus === 'sending' || !contactForm.subject || !contactForm.message}
                >
                  {submitStatus === 'sending' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Getting Started Guide */}
            <Card>
              <CardContent className="p-6">
                <Book className="h-8 w-8 mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete guide for new vendors to get started with the portal
                </p>
                <Button variant="outline" size="sm" onClick={() => router.push('/vendor-portal/support/getting-started')}>
                  Read Guide
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* User Manual */}
            <Card>
              <CardContent className="p-6">
                <FileText className="h-8 w-8 mb-4 text-green-600" />
                <h3 className="font-semibold text-gray-900 mb-2">User Manual</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed documentation for all portal features and functions
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card>
              <CardContent className="p-6">
                <ExternalLink className="h-8 w-8 mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Step-by-step video guides for common tasks
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Knowledge Base */}
            <Card>
              <CardContent className="p-6">
                <Lightbulb className="h-8 w-8 mb-4 text-yellow-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Knowledge Base</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Searchable database of articles and solutions
                </p>
                <Button variant="outline" size="sm" onClick={() => router.push('/vendor-portal/support/kb')}>
                  Browse Articles
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* API Documentation */}
            <Card>
              <CardContent className="p-6">
                <Globe className="h-8 w-8 mb-4 text-indigo-600" />
                <h3 className="font-semibold text-gray-900 mb-2">API Documentation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Technical documentation for integration developers
                </p>
                <Button variant="outline" size="sm">
                  View Docs
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 mb-4 text-red-600" />
                <h3 className="font-semibold text-gray-900 mb-2">System Requirements</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Browser and system requirements for optimal performance
                </p>
                <Button variant="outline" size="sm">
                  View Requirements
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current operational status of all services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { service: 'Vendor Portal', status: 'operational', uptime: '99.9%' },
                  { service: 'RFQ System', status: 'operational', uptime: '99.8%' },
                  { service: 'Document Upload', status: 'operational', uptime: '99.7%' },
                  { service: 'Email Notifications', status: 'operational', uptime: '99.9%' },
                  { service: 'Payment System', status: 'maintenance', uptime: '99.5%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'operational' ? 'bg-green-500' :
                        item.status === 'maintenance' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="font-medium">{item.service}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        item.status === 'operational' ? 'text-green-600' :
                        item.status === 'maintenance' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {item.status === 'operational' ? 'Operational' :
                         item.status === 'maintenance' ? 'Maintenance' :
                         'Down'}
                      </div>
                      <div className="text-xs text-gray-500">{item.uptime}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scheduled Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Maintenance</CardTitle>
                <CardDescription>Upcoming maintenance windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Database Optimization</div>
                      <div className="text-sm text-blue-700">December 15, 2024 - 2:00 AM to 4:00 AM WAT</div>
                      <div className="text-xs text-blue-600 mt-1">Minor performance improvements - No service interruption expected</div>
                    </div>
                  </div>

                  <div className="text-center text-gray-500 text-sm">
                    No other scheduled maintenance at this time
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Past 30 days incident history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">Email Delivery Delay - Resolved</div>
                    <div className="text-sm text-green-700">December 3, 2024 - Resolved in 45 minutes</div>
                    <div className="text-xs text-green-600 mt-1">Some notification emails experienced delays. All systems restored to normal operation.</div>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm">
                  No other incidents in the past 30 days
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      99.9% Uptime This Month
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you succeed. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setContactForm(prev => ({ ...prev, category: 'general' }))}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}