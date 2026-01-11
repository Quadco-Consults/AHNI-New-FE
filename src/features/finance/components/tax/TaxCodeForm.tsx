"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calculator,
  Percent,
  Calendar,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

// Types
type TaxType =
  | 'SALES_TAX'
  | 'VAT'
  | 'INCOME_TAX'
  | 'WITHHOLDING_TAX'
  | 'EXCISE_TAX'
  | 'CUSTOMS_DUTY'
  | 'OTHER';

type TaxStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

interface TaxCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  tax_rate: number;
  tax_type: TaxType;
  status: TaxStatus;
  effective_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface TaxCodeFormData {
  code: string;
  name: string;
  description: string;
  tax_rate: number;
  tax_type: TaxType;
  status: TaxStatus;
  effective_date: string;
  expiry_date: string;
  applies_to_sales: boolean;
  applies_to_purchases: boolean;
  compound_tax: boolean;
  calculation_method: 'PERCENTAGE' | 'FIXED_AMOUNT';
  jurisdiction: string;
  account_code?: string;
}

interface TaxCodeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxCode?: TaxCode;
  onSuccess?: () => void;
}

// Nigerian/AHNI specific tax configurations
const ahniTaxConfigurations = [
  {
    type: "VAT",
    name: "Nigeria VAT",
    rate: 7.5,
    description: "Nigerian Value Added Tax",
    jurisdiction: "Federal Republic of Nigeria"
  },
  {
    type: "WITHHOLDING_TAX",
    name: "Contract WHT",
    rate: 5.0,
    description: "Withholding Tax on Contracts",
    jurisdiction: "Nigeria"
  },
  {
    type: "WITHHOLDING_TAX",
    name: "Consultancy WHT",
    rate: 10.0,
    description: "Withholding Tax on Consultancy Services",
    jurisdiction: "Nigeria"
  },
  {
    type: "WITHHOLDING_TAX",
    name: "Rent WHT",
    rate: 10.0,
    description: "Withholding Tax on Rent",
    jurisdiction: "Nigeria"
  },
  {
    type: "INCOME_TAX",
    name: "Company Income Tax",
    rate: 30.0,
    description: "Corporate Income Tax",
    jurisdiction: "Nigeria"
  }
];

const jurisdictions = [
  "Federal Republic of Nigeria",
  "Lagos State",
  "Abuja FCT",
  "Rivers State",
  "Kano State",
  "International - Multi-jurisdiction"
];

export default function TaxCodeForm({
  open,
  onOpenChange,
  taxCode,
  onSuccess
}: TaxCodeFormProps) {
  const [formData, setFormData] = useState<TaxCodeFormData>({
    code: "",
    name: "",
    description: "",
    tax_rate: 0,
    tax_type: "VAT",
    status: "ACTIVE",
    effective_date: new Date().toISOString().split('T')[0],
    expiry_date: "",
    applies_to_sales: true,
    applies_to_purchases: false,
    compound_tax: false,
    calculation_method: "PERCENTAGE",
    jurisdiction: "Federal Republic of Nigeria",
    account_code: ""
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (taxCode) {
        // Edit mode
        setFormData({
          code: taxCode.code,
          name: taxCode.name,
          description: taxCode.description || "",
          tax_rate: taxCode.tax_rate,
          tax_type: taxCode.tax_type,
          status: taxCode.status,
          effective_date: taxCode.effective_date,
          expiry_date: taxCode.expiry_date || "",
          applies_to_sales: true,
          applies_to_purchases: false,
          compound_tax: false,
          calculation_method: "PERCENTAGE",
          jurisdiction: "Federal Republic of Nigeria",
          account_code: ""
        });
      } else {
        // Create mode
        setFormData({
          code: "",
          name: "",
          description: "",
          tax_rate: 0,
          tax_type: "VAT",
          status: "ACTIVE",
          effective_date: new Date().toISOString().split('T')[0],
          expiry_date: "",
          applies_to_sales: true,
          applies_to_purchases: false,
          compound_tax: false,
          calculation_method: "PERCENTAGE",
          jurisdiction: "Federal Republic of Nigeria",
          account_code: ""
        });
      }
      setSelectedTemplate("");
    }
  }, [open, taxCode]);

  const generateTaxCode = () => {
    const typePrefix = {
      'VAT': 'VAT',
      'SALES_TAX': 'ST',
      'WITHHOLDING_TAX': 'WHT',
      'INCOME_TAX': 'IT',
      'EXCISE_TAX': 'EXT',
      'CUSTOMS_DUTY': 'CD',
      'OTHER': 'TX'
    }[formData.tax_type];

    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const generatedCode = `${typePrefix}-${random}`;
    setFormData(prev => ({ ...prev, code: generatedCode }));
  };

  const applyTemplate = (templateIndex: number) => {
    const template = ahniTaxConfigurations[templateIndex];
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      tax_rate: template.rate,
      tax_type: template.type as TaxType,
      jurisdiction: template.jurisdiction
    }));
    setSelectedTemplate(templateIndex.toString());
  };

  const calculateSampleTax = () => {
    const sampleAmount = 10000; // $10,000 sample
    if (formData.calculation_method === 'PERCENTAGE') {
      return (sampleAmount * formData.tax_rate) / 100;
    }
    return formData.tax_rate; // Fixed amount
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error("Please enter a tax code");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter a tax name");
      return;
    }
    if (formData.tax_rate < 0 || formData.tax_rate > 100) {
      toast.error("Tax rate must be between 0 and 100");
      return;
    }
    if (!formData.effective_date) {
      toast.error("Please enter an effective date");
      return;
    }
    if (formData.expiry_date && new Date(formData.expiry_date) <= new Date(formData.effective_date)) {
      toast.error("Expiry date must be after effective date");
      return;
    }

    try {
      // Here you would call your API to create/update the tax code
      const action = taxCode ? "updated" : "created";

      toast.success(
        `Tax code "${formData.code}" ${action} successfully with ${formData.tax_rate}% rate`
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${taxCode ? 'update' : 'create'} tax code`);
    }
  };

  const getTaxTypeDescription = (type: TaxType) => {
    const descriptions = {
      'VAT': 'Value Added Tax applied to goods and services',
      'SALES_TAX': 'Tax on retail sales of goods and services',
      'WITHHOLDING_TAX': 'Tax withheld from payments at source',
      'INCOME_TAX': 'Tax on corporate or individual income',
      'EXCISE_TAX': 'Tax on specific goods like alcohol or tobacco',
      'CUSTOMS_DUTY': 'Tax on imported goods',
      'OTHER': 'Custom tax type for specific requirements'
    };
    return descriptions[type];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>{taxCode ? 'Edit Tax Code' : 'Create New Tax Code'}</span>
          </DialogTitle>
          <DialogDescription>
            {taxCode
              ? `Update tax code ${taxCode.code} configuration and settings`
              : 'Configure a new tax code for automatic tax calculations'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Templates */}
          {!taxCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Quick Templates (AHNI Tax Codes)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ahniTaxConfigurations.map((config, index) => (
                    <Button
                      key={index}
                      variant={selectedTemplate === index.toString() ? "default" : "outline"}
                      className="h-auto p-3 justify-start"
                      onClick={() => applyTemplate(index)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-gray-600">{config.rate}% - {config.type.replace('_', ' ')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="code">Tax Code *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateTaxCode}
                    >
                      Auto Generate
                    </Button>
                  </div>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., VAT-001, WHT-002"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Tax Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Nigerian VAT, Withholding Tax"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of when this tax applies..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tax_type">Tax Type *</Label>
                  <Select
                    value={formData.tax_type}
                    onValueChange={(value: TaxType) => setFormData({...formData, tax_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VAT">VAT (Value Added Tax)</SelectItem>
                      <SelectItem value="SALES_TAX">Sales Tax</SelectItem>
                      <SelectItem value="WITHHOLDING_TAX">Withholding Tax</SelectItem>
                      <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
                      <SelectItem value="EXCISE_TAX">Excise Tax</SelectItem>
                      <SelectItem value="CUSTOMS_DUTY">Customs Duty</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    {getTaxTypeDescription(formData.tax_type)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(value) => setFormData({...formData, jurisdiction: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Rate Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Percent className="w-4 h-4" />
                <span>Tax Rate Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calculation_method">Calculation Method</Label>
                  <Select
                    value={formData.calculation_method}
                    onValueChange={(value: 'PERCENTAGE' | 'FIXED_AMOUNT') =>
                      setFormData({...formData, calculation_method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax_rate">
                    Tax Rate * {formData.calculation_method === 'PERCENTAGE' ? '(%)' : '(Fixed Amount)'}
                  </Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    min="0"
                    max={formData.calculation_method === 'PERCENTAGE' ? "100" : undefined}
                    step="0.01"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({...formData, tax_rate: parseFloat(e.target.value) || 0})}
                    placeholder={formData.calculation_method === 'PERCENTAGE' ? "e.g., 7.5" : "e.g., 500"}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: TaxStatus) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sample Calculation */}
              {formData.tax_rate > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Sample Calculation</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    On $10,000: Tax = ${calculateSampleTax().toLocaleString()}
                    {formData.calculation_method === 'PERCENTAGE'
                      ? ` (${formData.tax_rate}%)`
                      : ' (Fixed Amount)'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Effective Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Effective Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effective_date">Effective Date *</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({...formData, effective_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    min={formData.effective_date}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="applies_to_sales"
                      checked={formData.applies_to_sales}
                      onChange={(e) => setFormData({...formData, applies_to_sales: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="applies_to_sales" className="text-sm">
                      Apply to Sales Transactions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="applies_to_purchases"
                      checked={formData.applies_to_purchases}
                      onChange={(e) => setFormData({...formData, applies_to_purchases: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="applies_to_purchases" className="text-sm">
                      Apply to Purchase Transactions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="compound_tax"
                      checked={formData.compound_tax}
                      onChange={(e) => setFormData({...formData, compound_tax: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="compound_tax" className="text-sm">
                      Compound Tax (tax on tax)
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="account_code">Accounting Code (Optional)</Label>
                  <Input
                    id="account_code"
                    value={formData.account_code}
                    onChange={(e) => setFormData({...formData, account_code: e.target.value})}
                    placeholder="e.g., 2200, TAX-PAYABLE"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Link to your chart of accounts for automatic posting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {formData.code && formData.name && formData.tax_rate > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tax Code Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Code:</span>
                    <span className="font-mono font-bold">{formData.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      {formData.tax_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-mono font-bold">
                      {formData.calculation_method === 'PERCENTAGE'
                        ? `${formData.tax_rate}%`
                        : `$${formData.tax_rate}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective:</span>
                    <span>{new Date(formData.effective_date).toLocaleDateString()}</span>
                  </div>
                  {formData.expiry_date && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{new Date(formData.expiry_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            {formData.tax_rate > 0 && (
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm">
                <strong>Rate: {formData.calculation_method === 'PERCENTAGE' ? `${formData.tax_rate}%` : `$${formData.tax_rate}`}</strong>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!formData.code.trim() || !formData.name.trim() || formData.tax_rate < 0}
            >
              {taxCode ? 'Update Tax Code' : 'Create Tax Code'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}