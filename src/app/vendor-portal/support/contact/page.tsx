"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  User,
  Send,
  ExternalLink,
  Calendar,
  FileText,
  Headphones,
  Users,
  Building,
  Globe,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  contact_info: string;
  availability: string;
  response_time: string;
  best_for: string[];
  color: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  responsibilities: string[];
  available_hours: string;
}

export default function VendorContactSupportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    department: "",
    priority: "normal",
    contact_method: "email"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Contact methods
  const contactMethods: ContactMethod[] = [
    {
      id: "email",
      name: "Email Support",
      description: "Send us a detailed message and we'll respond as soon as possible",
      icon: <Mail className="h-6 w-6" />,
      contact_info: "support@ahnigeria.org",
      availability: "24/7",
      response_time: "Within 4-6 hours",
      best_for: ["General inquiries", "Technical issues", "Documentation", "Non-urgent matters"],
      color: "blue"
    },
    {
      id: "phone",
      name: "Phone Support",
      description: "Speak directly with our support team for immediate assistance",
      icon: <Phone className="h-6 w-6" />,
      contact_info: "+234 (0) 123 456 789",
      availability: "Mon-Fri, 8AM-6PM WAT",
      response_time: "Immediate",
      best_for: ["Urgent issues", "Real-time assistance", "Complex problems", "Account lockouts"],
      color: "green"
    },
    {
      id: "live_chat",
      name: "Live Chat",
      description: "Chat with our support team in real-time during business hours",
      icon: <MessageCircle className="h-6 w-6" />,
      contact_info: "Available in portal",
      availability: "Mon-Fri, 9AM-5PM WAT",
      response_time: "Within 2-5 minutes",
      best_for: ["Quick questions", "Navigation help", "Status updates", "General guidance"],
      color: "purple"
    },
    {
      id: "ticket",
      name: "Support Ticket",
      description: "Create a detailed support ticket for tracking and follow-up",
      icon: <FileText className="h-6 w-6" />,
      contact_info: "Vendor Portal",
      availability: "24/7",
      response_time: "Within 24 hours",
      best_for: ["Bug reports", "Feature requests", "Complex issues", "Documentation needs"],
      color: "orange"
    }
  ];

  // Department information
  const departments: Department[] = [
    {
      id: "general",
      name: "General Support",
      description: "General questions and portal assistance",
      email: "support@ahnigeria.org",
      phone: "+234 (0) 123 456 789",
      responsibilities: [
        "Portal navigation help",
        "Account setup assistance",
        "General inquiries",
        "Documentation requests"
      ],
      available_hours: "Mon-Fri, 8AM-6PM WAT"
    },
    {
      id: "procurement",
      name: "Procurement Team",
      description: "RFQ questions and bidding process support",
      email: "procurement@ahnigeria.org",
      phone: "+234 (0) 123 456 790",
      responsibilities: [
        "RFQ clarifications",
        "Bidding process guidance",
        "Prequalification questions",
        "Tender documentation",
        "Submission deadlines"
      ],
      available_hours: "Mon-Fri, 8AM-5PM WAT"
    },
    {
      id: "technical",
      name: "Technical Support",
      description: "Technical issues and portal functionality",
      email: "techsupport@ahnigeria.org",
      responsibilities: [
        "Login and access issues",
        "File upload problems",
        "Browser compatibility",
        "System errors and bugs",
        "Password resets"
      ],
      available_hours: "Mon-Fri, 8AM-6PM WAT"
    },
    {
      id: "finance",
      name: "Finance Department",
      description: "Payment, invoicing, and contract questions",
      email: "finance@ahnigeria.org",
      responsibilities: [
        "Payment status inquiries",
        "Invoice submissions",
        "Contract terms",
        "Banking details",
        "Tax documentation"
      ],
      available_hours: "Mon-Fri, 9AM-4PM WAT"
    },
    {
      id: "vendor_relations",
      name: "Vendor Relations",
      description: "Vendor registration and relationship management",
      email: "vendors@ahnigeria.org",
      responsibilities: [
        "Vendor registration",
        "Profile verification",
        "Category applications",
        "Compliance requirements",
        "Vendor development"
      ],
      available_hours: "Mon-Fri, 8AM-5PM WAT"
    }
  ];

  // Office locations
  const officeLocations = [
    {
      id: "abuja",
      name: "AHNI Head Office",
      address: "123 Central Business District, Abuja, Nigeria",
      phone: "+234 (0) 123 456 789",
      email: "info@ahnigeria.org",
      hours: "Mon-Fri: 8AM-6PM WAT"
    },
    {
      id: "lagos",
      name: "Lagos Regional Office",
      address: "456 Victoria Island, Lagos, Nigeria",
      phone: "+234 (0) 123 456 788",
      email: "lagos@ahnigeria.org",
      hours: "Mon-Fri: 8AM-5PM WAT"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        subject: "",
        message: "",
        department: "",
        priority: "normal",
        contact_method: "email"
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Headphones className="h-8 w-8" />
          Contact Support
        </h1>
        <p className="text-gray-600 mt-1">
          Get in touch with our support team - we're here to help you succeed
        </p>
      </div>

      {/* Contact Methods */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Contact Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-${method.color}-500`}
              onClick={() => {
                if (method.id === 'ticket') {
                  router.push('/vendor-portal/support/ticket');
                } else if (method.id === 'live_chat') {
                  // Implement live chat functionality
                  console.log('Opening live chat...');
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${method.color}-100 text-${method.color}-600`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">{method.contact_info}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{method.availability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-gray-500" />
                        <span>Response: {method.response_time}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {method.best_for.slice(0, 2).map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                        {method.best_for.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{method.best_for.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your message has been sent successfully! We'll respond within 4-6 hours during business hours.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_method">Preferred Response Method</Label>
                  <Select value={formData.contact_method} onValueChange={(value) => setFormData({...formData, contact_method: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="portal">Portal Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide detailed information about your inquiry or issue..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Department Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{dept.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <a href={`mailto:${dept.email}`} className="text-blue-600 hover:underline">
                          {dept.email}
                        </a>
                      </div>
                      {dept.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <a href={`tel:${dept.phone}`} className="text-blue-600 hover:underline">
                            {dept.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{dept.available_hours}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Handles:</p>
                      <div className="flex flex-wrap gap-1">
                        {dept.responsibilities.slice(0, 3).map((resp, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {resp}
                          </Badge>
                        ))}
                        {dept.responsibilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{dept.responsibilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Office Locations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Office Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeLocations.map((office) => (
            <Card key={office.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{office.name}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 text-gray-500 mt-1 flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <a href={`tel:${office.phone}`} className="text-blue-600 hover:underline">
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <a href={`mailto:${office.email}`} className="text-blue-600 hover:underline">
                          {office.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-orange-100">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Emergency Support</h3>
              <p className="text-sm text-gray-700 mb-2">
                For urgent issues outside business hours that affect ongoing procurement processes:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-600" />
                  <span className="font-medium">Emergency Line: +234 (0) 800 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gray-600" />
                  <span>Emergency Email: emergency@ahnigeria.org</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                * Emergency support is for critical issues only. Response time may vary during weekends and holidays.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need More Help?</h3>
          <p className="text-gray-600 mb-4">
            Check out our knowledge base or create a support ticket for detailed assistance.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push('/vendor-portal/support/kb')}>
              <FileText className="h-4 w-4 mr-1" />
              Browse Knowledge Base
            </Button>
            <Button variant="outline" onClick={() => router.push('/vendor-portal/support/ticket')}>
              <User className="h-4 w-4 mr-1" />
              Create Support Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}