"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Switch } from "components/ui/switch";
import { Alert, AlertDescription } from "components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import {
  Settings,
  Bell,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Key,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  Clock,
  Globe
} from "lucide-react";
import { useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "components/Loading";

export default function VendorSettingsPage() {
  const router = useRouter();
  const { data: vendorProfile, isLoading, error } = useVendorProfile();

  // Form states - will be populated when vendorProfile loads
  const [accountSettings, setAccountSettings] = useState({
    email: '',
    phone: '',
    company_address: '',
    website: '',
    timezone: 'Africa/Lagos',
    language: 'en'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_new_rfqs: true,
    email_bid_updates: true,
    email_order_updates: true,
    email_payment_alerts: true,
    sms_urgent_updates: false,
    sms_order_confirmations: true,
    browser_notifications: true,
    weekly_summary: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: '30',
    login_notifications: true,
    api_access_enabled: false
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Populate form data when vendor profile loads
  useEffect(() => {
    if (vendorProfile) {
      setAccountSettings(prev => ({
        ...prev,
        email: vendorProfile.email || '',
        phone: vendorProfile.phone_number || '',
        company_address: vendorProfile.company_address || '',
        website: vendorProfile.website || '',
        timezone: vendorProfile.timezone || 'Africa/Lagos',
        language: vendorProfile.language || 'en'
      }));
    }
  }, [vendorProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load settings. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const handleAccountSave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleNotificationSave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleSecuritySave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleDataExport = () => {
    // Comprehensive data export including all vendor information
    const data = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        company: vendorProfile?.company_name || 'Unknown'
      },
      profile: {
        company_name: vendorProfile?.company_name,
        email: vendorProfile?.email,
        phone_number: vendorProfile?.phone_number,
        company_address: vendorProfile?.company_address,
        status: vendorProfile?.status,
        is_active: vendorProfile?.is_active,
        type_of_business: vendorProfile?.type_of_business,
        registration_date: vendorProfile?.registration_date,
        last_login: vendorProfile?.last_login,
        approved_categories: vendorProfile?.approved_categories,
        submitted_categories: vendorProfile?.submitted_categories,
        submitted_bids: vendorProfile?.submitted_bids,
        awarded_contracts: vendorProfile?.awarded_contracts,
        prequalification_summary: vendorProfile?.prequalification_summary
      },
      settings: {
        account: accountSettings,
        notifications: notificationSettings,
        security: {
          two_factor_enabled: securitySettings.two_factor_enabled,
          session_timeout: securitySettings.session_timeout,
          login_notifications: securitySettings.login_notifications,
          api_access_enabled: securitySettings.api_access_enabled
        }
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vendorProfile?.company_name?.replace(/[^a-zA-Z0-9]/g, '-') || 'vendor'}-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage preferences for <span className="font-medium">{vendorProfile?.company_name || 'your account'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={vendorProfile?.status === 'Approved' ? 'default' : 'secondary'}
            className="text-sm"
          >
            {vendorProfile?.status || 'Unknown Status'}
          </Badge>
          <Button variant="outline" onClick={handleDataExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {saveStatus === 'saved' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to save settings. Please check your input and try again.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Settings className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={vendorProfile?.company_name || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support to change company name
                  </p>
                </div>

                <div>
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={vendorProfile?.registration_number || 'Not provided'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    value={vendorProfile?.type_of_business || 'Not specified'}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support to change business type
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={accountSettings.phone}
                    onChange={(e) => setAccountSettings(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="company_address">Company Address</Label>
                  <Textarea
                    id="company_address"
                    rows={3}
                    value={accountSettings.company_address}
                    onChange={(e) => setAccountSettings(prev => ({
                      ...prev,
                      company_address: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={accountSettings.website}
                    onChange={(e) => setAccountSettings(prev => ({
                      ...prev,
                      website: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={accountSettings.timezone}
                    onValueChange={(value) => setAccountSettings(prev => ({
                      ...prev,
                      timezone: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
                      <SelectItem value="Africa/Abuja">Abuja (GMT+1)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                <Button onClick={handleAccountSave} disabled={saveStatus === 'saving'}>
                  {saveStatus === 'saving' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email_new_rfqs', label: 'New RFQ Opportunities', description: 'Get notified when new RFQs match your categories' },
                { key: 'email_bid_updates', label: 'Bid Status Updates', description: 'Updates on your submitted bids and evaluations' },
                { key: 'email_order_updates', label: 'Purchase Order Updates', description: 'Status changes on your purchase orders' },
                { key: 'email_payment_alerts', label: 'Payment Alerts', description: 'Payment due dates and confirmations' },
                { key: 'weekly_summary', label: 'Weekly Summary', description: 'Weekly summary of your vendor activity' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                  </div>
                  <Switch
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      [key]: checked
                    }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Receive important updates via SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'sms_urgent_updates', label: 'Urgent Updates', description: 'Critical updates requiring immediate attention' },
                { key: 'sms_order_confirmations', label: 'Order Confirmations', description: 'SMS confirmation when orders are placed' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                  </div>
                  <Switch
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      [key]: checked
                    }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleNotificationSave} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        current_password: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        new_password: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        confirm_password: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handlePasswordChange}
                  disabled={saveStatus === 'saving' || !passwordForm.current_password || !passwordForm.new_password}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>
                Additional security options for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                </div>
                <Switch
                  checked={securitySettings.two_factor_enabled}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({
                    ...prev,
                    two_factor_enabled: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Login Notifications</div>
                  <div className="text-sm text-gray-600">Get notified when someone logs into your account</div>
                </div>
                <Switch
                  checked={securitySettings.login_notifications}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({
                    ...prev,
                    login_notifications: checked
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                <Select
                  value={securitySettings.session_timeout}
                  onValueChange={(value) => setSecuritySettings(prev => ({
                    ...prev,
                    session_timeout: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSecuritySave} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Control how your data is used and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Approved Categories</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Categories you are qualified to bid on
                  </p>
                  {vendorProfile?.approved_categories && vendorProfile.approved_categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vendorProfile.approved_categories.map((category: any, index: number) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {typeof category === 'string' ? category : category.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No approved categories yet</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download a copy of your vendor data and settings
                  </p>
                  <Button variant="outline" onClick={handleDataExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Account Status:</span>
                      <Badge variant={
                        vendorProfile?.status === 'Approved' ? 'default' :
                        vendorProfile?.status === 'Pending' ? 'secondary' :
                        'destructive'
                      }>
                        {vendorProfile?.status || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Company ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {vendorProfile?.id || 'Not available'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Member Since:</span>
                      <span>
                        {vendorProfile?.registration_date
                          ? new Date(vendorProfile.registration_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not available'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Login:</span>
                      <span>
                        {vendorProfile?.last_login
                          ? new Date(vendorProfile.last_login).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Not available'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Approved Categories:</span>
                      <span className="font-semibold text-green-600">
                        {vendorProfile?.approved_categories?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Status:</span>
                      <Badge variant={vendorProfile?.is_active ? 'default' : 'secondary'}>
                        {vendorProfile?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Request Account Suspension
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}