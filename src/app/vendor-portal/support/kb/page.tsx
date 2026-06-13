"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Video,
  Download,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Lightbulb,
  AlertCircle,
  Settings,
  CreditCard,
  HelpCircle,
  Shield,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  created_date: string;
  updated_date: string;
  author: {
    name: string;
    role: string;
  };
  views: number;
  helpful_votes: number;
  not_helpful_votes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_read_time: number;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  related_articles: string[];
  is_featured: boolean;
  is_popular: boolean;
}

interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  article_count: number;
  color: string;
}

export default function VendorKnowledgeBasePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  // Mock knowledge base categories
  const categories: KnowledgeBaseCategory[] = [
    {
      id: "getting_started",
      name: "Getting Started",
      description: "Learn the basics of using the vendor portal",
      icon: <Lightbulb className="h-6 w-6" />,
      article_count: 12,
      color: "blue"
    },
    {
      id: "rfq_bidding",
      name: "RFQ & Bidding",
      description: "How to find and bid on procurement opportunities",
      icon: <FileText className="h-6 w-6" />,
      article_count: 18,
      color: "green"
    },
    {
      id: "account_management",
      name: "Account Management",
      description: "Managing your vendor profile and settings",
      icon: <Settings className="h-6 w-6" />,
      article_count: 8,
      color: "purple"
    },
    {
      id: "payments_billing",
      name: "Payments & Billing",
      description: "Understanding payments, invoicing, and contracts",
      icon: <CreditCard className="h-6 w-6" />,
      article_count: 15,
      color: "orange"
    },
    {
      id: "technical_support",
      name: "Technical Support",
      description: "Troubleshooting portal issues and technical problems",
      icon: <Zap className="h-6 w-6" />,
      article_count: 22,
      color: "red"
    },
    {
      id: "compliance_security",
      name: "Compliance & Security",
      description: "Security requirements and compliance guidelines",
      icon: <Shield className="h-6 w-6" />,
      article_count: 10,
      color: "indigo"
    }
  ];

  // Mock articles data
  const [articles] = useState<KnowledgeBaseArticle[]>([
    {
      id: "1",
      title: "How to Submit Your First Bid",
      content: "Step-by-step guide on submitting bids...",
      summary: "Learn how to navigate the bidding process from start to finish, including document preparation and submission requirements.",
      category: "rfq_bidding",
      tags: ["bidding", "rfq", "submission", "beginner"],
      created_date: "2024-11-15T10:00:00Z",
      updated_date: "2024-12-01T14:00:00Z",
      author: {
        name: "AHNI Support Team",
        role: "Support Specialist"
      },
      views: 1250,
      helpful_votes: 89,
      not_helpful_votes: 5,
      difficulty: "beginner",
      estimated_read_time: 5,
      related_articles: ["2", "3"],
      is_featured: true,
      is_popular: true
    },
    {
      id: "2",
      title: "Understanding Prequalification Categories",
      content: "Detailed explanation of prequalification categories...",
      summary: "Comprehensive guide to understanding different prequalification categories and how to apply for them.",
      category: "getting_started",
      tags: ["prequalification", "categories", "application"],
      created_date: "2024-11-20T09:00:00Z",
      updated_date: "2024-11-20T09:00:00Z",
      author: {
        name: "Procurement Team",
        role: "Procurement Officer"
      },
      views: 890,
      helpful_votes: 67,
      not_helpful_votes: 3,
      difficulty: "intermediate",
      estimated_read_time: 8,
      related_articles: ["1", "4"],
      is_featured: true,
      is_popular: false
    },
    {
      id: "3",
      title: "Troubleshooting Upload Issues",
      content: "Common file upload problems and solutions...",
      summary: "Solutions for common document upload problems including file size limits and supported formats.",
      category: "technical_support",
      tags: ["upload", "files", "troubleshooting", "technical"],
      created_date: "2024-11-25T16:00:00Z",
      updated_date: "2024-12-03T11:00:00Z",
      author: {
        name: "Technical Support",
        role: "Technical Specialist"
      },
      views: 654,
      helpful_votes: 45,
      not_helpful_votes: 8,
      difficulty: "beginner",
      estimated_read_time: 3,
      attachments: [
        {
          id: "1",
          name: "upload_troubleshooting_guide.pdf",
          type: "application/pdf",
          url: "#"
        }
      ],
      related_articles: ["5"],
      is_featured: false,
      is_popular: true
    },
    {
      id: "4",
      title: "Setting Up Your Company Profile",
      content: "Complete guide to setting up your vendor profile...",
      summary: "Everything you need to know about creating and maintaining an effective company profile in the vendor portal.",
      category: "account_management",
      tags: ["profile", "setup", "company", "verification"],
      created_date: "2024-10-30T08:00:00Z",
      updated_date: "2024-11-15T12:00:00Z",
      author: {
        name: "Vendor Relations",
        role: "Account Manager"
      },
      views: 1100,
      helpful_votes: 78,
      not_helpful_votes: 4,
      difficulty: "beginner",
      estimated_read_time: 10,
      related_articles: ["2"],
      is_featured: false,
      is_popular: true
    },
    {
      id: "5",
      title: "Payment Terms and Invoice Requirements",
      content: "Understanding AHNI's payment processes...",
      summary: "Detailed information about payment terms, invoice requirements, and the payment approval process.",
      category: "payments_billing",
      tags: ["payments", "invoicing", "contracts", "terms"],
      created_date: "2024-11-10T14:00:00Z",
      updated_date: "2024-11-28T10:00:00Z",
      author: {
        name: "Finance Team",
        role: "Finance Officer"
      },
      views: 432,
      helpful_votes: 34,
      not_helpful_votes: 2,
      difficulty: "intermediate",
      estimated_read_time: 12,
      related_articles: ["6"],
      is_featured: false,
      is_popular: false
    },
    {
      id: "6",
      title: "Security Best Practices for Vendors",
      content: "Important security guidelines for vendor portal users...",
      summary: "Essential security practices to protect your account and sensitive information when using the vendor portal.",
      category: "compliance_security",
      tags: ["security", "best practices", "compliance", "data protection"],
      created_date: "2024-11-05T11:00:00Z",
      updated_date: "2024-11-18T15:00:00Z",
      author: {
        name: "IT Security Team",
        role: "Security Specialist"
      },
      views: 567,
      helpful_votes: 52,
      not_helpful_votes: 1,
      difficulty: "advanced",
      estimated_read_time: 15,
      related_articles: ["7"],
      is_featured: true,
      is_popular: false
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'default';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.color || 'gray';
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || article.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredArticles = articles.filter((article: any) => article.is_featured);
  const popularArticles = articles.filter((article: any) => article.is_popular);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Knowledge Base
        </h1>
        <p className="text-gray-600 mt-1">
          Find answers, learn best practices, and get the most out of your vendor portal
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles, guides, and FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-${category.color}-500`}
              onClick={() => setCategoryFilter(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-${category.color}-100 text-${category.color}-600`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {category.article_count} articles
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.slice(0, 4).map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs capitalize">
                      {categories.find((c: any) => c.id === article.category)?.name}
                    </Badge>
                    <Badge variant={getDifficultyBadgeVariant(article.difficulty)} className="text-xs capitalize">
                      {article.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.estimated_read_time} min read
                      </span>
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{article.helpful_votes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search Results or All Articles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {searchTerm ? `Search Results (${filteredArticles.length})` : 'All Articles'}
        </h2>
        {filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {article.title}
                        </h3>
                        {article.is_popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                        {article.is_featured && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {categories.find((c: any) => c.id === article.category)?.name}
                        </Badge>
                        <Badge variant={getDifficultyBadgeVariant(article.difficulty)} className="text-xs capitalize">
                          {article.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.estimated_read_time} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author.name}
                        </span>
                        <span>Updated {formatDate(article.updated_date)}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {article.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{article.views} views</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.helpful_votes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" />
                            {article.not_helpful_votes}
                          </span>
                          {article.attachments && article.attachments.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {article.attachments.length} files
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => router.push(`/vendor-portal/support/kb/${article.id}`)}
                        size="sm"
                      >
                        Read Article
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No articles match "${searchTerm}"` : "No articles available"}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setDifficultyFilter("all");
                  }}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Articles */}
      {popularArticles.length > 0 && !searchTerm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Popular Articles</CardTitle>
            <CardDescription>Most viewed and helpful articles from our community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularArticles.slice(0, 5).map((article, index) => (
                <div key={article.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{article.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{article.views} views</span>
                      <span>•</span>
                      <span>{article.helpful_votes} helpful</span>
                      <span>•</span>
                      <span>{article.estimated_read_time} min</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/vendor-portal/support/kb/${article.id}`)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Can't Find What You're Looking For?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help. Create a support ticket or contact us directly.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push('/vendor-portal/support/ticket')}>
              Create Support Ticket
            </Button>
            <Button variant="outline" onClick={() => router.push('/vendor-portal/support/contact')}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}