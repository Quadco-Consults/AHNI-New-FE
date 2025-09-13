// Mock chat service for development/testing with enhanced capabilities
export const mockChatService = {
  async sendMessage(request: { message: string; conversation_id?: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    const userMessage = request.message.toLowerCase();
    
    let response = "";
    let responseType: 'text' | 'structured' | 'navigation' | 'task_guide' = 'text';
    let structuredData: any = null;
    
    // Enhanced navigation and guidance responses
    if (userMessage.includes('where') && (userMessage.includes('employee') || userMessage.includes('hr'))) {
      responseType = 'navigation';
      response = "📍 **Employee Management Location**\n\nYou can find employee management in:\n**Dashboard → HR Management → Employee Records**\n\n**Available Actions:**\n• View all employees\n• Create new employee\n• Search & filter\n• Export employee data\n• Import bulk data";
      structuredData = {
        type: 'navigation',
        target: '/dashboard/hr/employees',
        breadcrumb: ['Dashboard', 'HR Management', 'Employee Records'],
        actions: ['view', 'create', 'search', 'export', 'import']
      };
    } else if (userMessage.includes('create') && userMessage.includes('employee')) {
      responseType = 'task_guide';
      response = "👤 **Creating a New Employee - Step by Step**\n\n**Estimated Time:** 10-15 minutes\n**Steps:** 6\n\n**Step 1:** Navigate to HR → Employee Records\n**Step 2:** Click 'Create New Employee'\n**Step 3:** Fill Personal Information (Name, Email, Phone)\n**Step 4:** Set Job Details (Position, Department, Start Date)\n**Step 5:** Configure Access & Permissions\n**Step 6:** Review and Submit\n\n💡 **Tip:** Have the employee's documents ready before starting!";
      structuredData = {
        type: 'task_guide',
        task: 'create_employee',
        estimatedTime: '10-15 minutes',
        steps: 6,
        currentStep: 1,
        nextAction: 'Navigate to HR → Employee Records'
      };
    } else if (userMessage.includes('leave request') || (userMessage.includes('submit') && userMessage.includes('leave'))) {
      responseType = 'task_guide';
      response = "🏖️ **Submitting Leave Request - Quick Guide**\n\n**Estimated Time:** 3-5 minutes\n**Steps:** 5\n\n**Step 1:** Go to Dashboard → HR → Leave Management\n**Step 2:** Click 'New Leave Request'\n**Step 3:** Select leave type and dates\n**Step 4:** Add reason and attach documents (if needed)\n**Step 5:** Submit for approval\n\n**⚡ Quick Tips:**\n• Submit at least 7 days in advance\n• Check your leave balance first\n• Emergency leave can be submitted same day";
      structuredData = {
        type: 'task_guide',
        task: 'submit_leave_request',
        estimatedTime: '3-5 minutes',
        steps: 5,
        urgencyLevel: userMessage.includes('urgent') ? 'high' : 'normal'
      };
    } else if (userMessage.includes('purchase order') || userMessage.includes('po')) {
      responseType = 'task_guide';
      response = "📦 **Creating Purchase Order - Complete Workflow**\n\n**Estimated Time:** 15-20 minutes\n**Steps:** 6\n\n**Step 1:** Navigate to Procurement → Purchase Orders\n**Step 2:** Click 'Create New PO'\n**Step 3:** Select vendor and add items\n**Step 4:** Set delivery details and terms\n**Step 5:** Add approval workflow\n**Step 6:** Submit for review\n\n**📋 Before You Start:**\n• Verify budget availability\n• Ensure vendor is pre-approved\n• Have item specifications ready";
      structuredData = {
        type: 'task_guide',  
        task: 'create_purchase_order',
        estimatedTime: '15-20 minutes',
        steps: 6,
        prerequisites: ['budget_check', 'vendor_approval', 'item_specs']
      };
    } else if (userMessage.includes('workflow') || userMessage.includes('approval process')) {
      responseType = 'structured';
      response = "⚡ **Approval Workflows in AHNI**\n\n**🔄 Purchase Order Approval:**\n1. Requester submits PO\n2. Department Head approval (< ₦500K)\n3. Finance approval (> ₦500K)\n4. Executive approval (> ₦2M)\n5. Auto-timeout: 3 business days per stage\n\n**👥 Leave Request Approval:**\n1. Employee submits request\n2. Direct supervisor approval\n3. HR validation\n4. Auto-approval for < 3 days (if balance available)\n\n**⏰ Escalation Rules:**\n• No response in 48hrs → Auto-escalates\n• Emergency requests → Immediate notification\n• Weekend submissions → Monday processing";
    } else if (userMessage.includes('what can i do') || userMessage.includes('features')) {
      responseType = 'structured';
      response = "🚀 **Available Features by Module**\n\n**👥 HR Module:**\n• Employee management & records\n• Leave requests & approvals\n• Payroll processing\n• Performance reviews\n• Workforce analytics\n\n**💰 Finance Module:**\n• Budget tracking & reports\n• Expense management\n• Financial analytics\n• Payment processing\n• Chart of accounts\n\n**📋 Procurement Module:**\n• EOI (Expression of Interest) creation\n• RFP management\n• Vendor evaluation\n• Purchase orders\n• Contract management\n\n**🏗️ Projects Module:**\n• Project creation & tracking\n• Resource allocation\n• Timeline management\n• Progress reporting\n• Budget monitoring";
    } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = "Hello! I'm your AHNI assistant. I can help you with procurement, HR, finance, and project management. What would you like to know?";
    } else if (userMessage.includes('procurement') || userMessage.includes('rfp') || userMessage.includes('vendor') || userMessage.includes('contract')) {
      response = "I can help with procurement processes! I can assist with:\n\n• EOI (Expression of Interest) creation\n• RFP (Request for Proposal) management\n• Vendor management and evaluation\n• Contract management\n• Purchase orders\n• Procurement analytics\n\nWhat specific procurement task would you like help with?";
    } else if (userMessage.includes('hr') || userMessage.includes('human resource')) {
      response = "I can assist with HR matters including employee records, leave management, payroll, performance reviews, and workforce analytics. How can I help with HR today?";
    } else if (userMessage.includes('finance') || userMessage.includes('budget')) {
      response = "I can help with financial information such as budget tracking, expense reports, financial analytics, and payment processing. What financial data are you looking for?";
    } else if (userMessage.includes('project')) {
      response = "I can provide information about project management including project status, timelines, resources, budgets, and progress reports. Which project would you like to know about?";
    } else if (userMessage.includes('eoi') || userMessage.includes('expression of interest')) {
      response = "I can help you create an EOI (Expression of Interest)! Here's what I can assist with:\n\n• Creating a new EOI document\n• EOI templates and requirements\n• Submission guidelines\n• Status tracking\n• Required documentation\n\nTo create an EOI, you can navigate to the Procurement section → EOI Management, or would you like me to guide you through the process?";
    } else if (userMessage.includes('create eoi') || userMessage.includes('new eoi')) {
      response = "Great! Let's create a new EOI. Here are the steps:\n\n1. Go to Dashboard → Procurement Management → EOI\n2. Click 'Create New EOI'\n3. Fill in the required details:\n   • Project name\n   • Description\n   • Timeline\n   • Budget range\n   • Required qualifications\n\nWould you like me to help you with any specific section of the EOI creation?";
    } else if (userMessage.includes('help')) {
      response = "I'm here to help! I can assist you with:\n\n📋 **Procurement:**\n• Create EOI → Dashboard → Procurement → EOI Management\n• Manage RFPs → Dashboard → Procurement → RFP Management\n• Vendor management\n\n👥 **HR:**\n• Employee records\n• Leave management\n• Payroll processing\n\n💰 **Finance:**\n• Budget tracking\n• Expense reports\n• Financial analytics\n\n🏗️ **Projects:**\n• Project status & timelines\n• Resource management\n\nWhat would you like to explore?";
    } else {
      const genericResponses = [
        "That's an interesting question! Let me help you find the information you need in the AHNI system.",
        "I understand you're looking for information about that. Let me check what data is available.",
        "Based on your query, I can help you navigate to the relevant section of the system. What specific details do you need?",
        "I'm here to assist with your AHNI system needs. Could you provide a bit more context about what you're looking for?",
        "Great question! I can help you access that information through the appropriate module in AHNI."
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    return {
      response,
      conversation_id: request.conversation_id || `mock-session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message_id: `msg-${Date.now()}`,
      response_type: responseType,
      structured_data: structuredData
    };
  },

  async createConversation() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      conversation_id: `mock-session-${Date.now()}`,
      created_at: new Date().toISOString()
    };
  },

  async getConversations() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 'mock-session-1',
        messages: [
          {
            id: 'msg-1',
            content: 'Hello',
            sender: 'user' as const,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'msg-2', 
            content: 'Hi! How can I help you today?',
            sender: 'bot' as const,
            timestamp: new Date(Date.now() - 3599000).toISOString()
          }
        ],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3599000).toISOString()
      }
    ];
  },

  async getConversation(conversationId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: conversationId,
      messages: [
        {
          id: 'msg-1',
          content: 'Test message',
          sender: 'user' as const,
          timestamp: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async deleteConversation(conversationId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Mock: Deleted conversation ${conversationId}`);
  }
};