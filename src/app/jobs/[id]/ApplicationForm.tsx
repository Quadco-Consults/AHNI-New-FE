"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Briefcase, Building2, Upload, FileText } from "lucide-react";

interface ApplicationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  positionName: string;
}

export function ApplicationFormFields({ formData, setFormData, positionName }: ApplicationFormProps) {
  return (
    <div className="space-y-8">
      {/* Applicant Information Section */}
      <div className="bg-gray-700 text-white p-4 rounded-t-lg">
        <h3 className="font-bold text-lg">Applicant Information</h3>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-b-lg border border-gray-200">
        {/* Full Name */}
        <div>
          <Label className="text-gray-900 font-semibold mb-3 block">
            Applicant Name <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
                className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">Surname</p>
            </div>
            <div>
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">First Name</p>
            </div>
            <div>
              <Input
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">Middle Name</p>
            </div>
          </div>
        </div>

        {/* Home Address */}
        <div>
          <Label className="text-gray-900 font-semibold mb-2 block">
            Home Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Enter your full home address"
              value={formData.homeAddress}
              onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Phone and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Phone No <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Position Applied For and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Position Applied For
            </Label>
            <Input
              value={formData.positionAppliedFor || positionName}
              onChange={(e) => setFormData({ ...formData, positionAppliedFor: e.target.value })}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Position Location
            </Label>
            <Input
              placeholder="Enter desired location"
              value={formData.positionLocation}
              onChange={(e) => setFormData({ ...formData, positionLocation: e.target.value })}
            />
          </div>
        </div>

        {/* Current Position and Employer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Current Position
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Your current job title"
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Current Employer
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Your current company"
                value={formData.currentEmployer}
                onChange={(e) => setFormData({ ...formData, currentEmployer: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Citizenship Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-3 block">
              Are you a Citizen of Nigeria? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.nigerianCitizen}
              onValueChange={(value) => setFormData({ ...formData, nigerianCitizen: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="citizen-yes" />
                <Label htmlFor="citizen-yes" className="font-normal cursor-pointer">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="citizen-no" />
                <Label htmlFor="citizen-no" className="font-normal cursor-pointer">NO</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.nigerianCitizen === "no" && (
            <div>
              <Label className="text-gray-900 font-semibold mb-3 block">
                Are you authorized to work in Nigeria?
              </Label>
              <RadioGroup
                value={formData.authorizedToWork}
                onValueChange={(value) => setFormData({ ...formData, authorizedToWork: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="authorized-yes" />
                  <Label htmlFor="authorized-yes" className="font-normal cursor-pointer">YES</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="authorized-no" />
                  <Label htmlFor="authorized-no" className="font-normal cursor-pointer">NO</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Worked for AHNi Before */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-3 block">
              Have you ever worked for AHNi before?
            </Label>
            <RadioGroup
              value={formData.workedForAhni}
              onValueChange={(value) => setFormData({ ...formData, workedForAhni: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="worked-yes" />
                <Label htmlFor="worked-yes" className="font-normal cursor-pointer">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="worked-no" />
                <Label htmlFor="worked-no" className="font-normal cursor-pointer">NO</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.workedForAhni === "yes" && (
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">
                If yes, when?
              </Label>
              <Input
                placeholder="Enter the period (e.g., Jan 2020 - Dec 2021)"
                value={formData.workedForAhniWhen}
                onChange={(e) => setFormData({ ...formData, workedForAhniWhen: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Professional References Section */}
      <div className="bg-gray-700 text-white p-4 rounded-t-lg mt-8">
        <h3 className="font-bold text-lg">Professional References</h3>
        <p className="text-sm mt-1 opacity-90">Please provide 3 professional references</p>
      </div>

      <div className="space-y-8 p-6 bg-white rounded-b-lg border border-gray-200">
        {/* Reference 1 */}
        <div>
          <h4 className="font-semibold text-blue-900 mb-4">REFEREE 1 <span className="text-red-500">*</span></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Title</Label>
              <Select value={formData.ref1Title} onValueChange={(value) => setFormData({ ...formData, ref1Title: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Full name"
                value={formData.ref1Name}
                onChange={(e) => setFormData({ ...formData, ref1Name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Phone Number <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.ref1Phone}
                  onChange={(e) => setFormData({ ...formData, ref1Phone: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Email <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="referee@example.com"
                  value={formData.ref1Email}
                  onChange={(e) => setFormData({ ...formData, ref1Email: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Position</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Job title"
                  value={formData.ref1Position}
                  onChange={(e) => setFormData({ ...formData, ref1Position: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Employer</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Company name"
                  value={formData.ref1Employer}
                  onChange={(e) => setFormData({ ...formData, ref1Employer: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reference 2 */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-blue-900 mb-4">REFEREE 2 <span className="text-red-500">*</span></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Title</Label>
              <Select value={formData.ref2Title} onValueChange={(value) => setFormData({ ...formData, ref2Title: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Full name"
                value={formData.ref2Name}
                onChange={(e) => setFormData({ ...formData, ref2Name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Phone Number <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.ref2Phone}
                  onChange={(e) => setFormData({ ...formData, ref2Phone: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Email <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="referee@example.com"
                  value={formData.ref2Email}
                  onChange={(e) => setFormData({ ...formData, ref2Email: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Position</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Job title"
                  value={formData.ref2Position}
                  onChange={(e) => setFormData({ ...formData, ref2Position: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Employer</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Company name"
                  value={formData.ref2Employer}
                  onChange={(e) => setFormData({ ...formData, ref2Employer: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reference 3 */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-blue-900 mb-4">REFEREE 3 <span className="text-red-500">*</span></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Title</Label>
              <Select value={formData.ref3Title} onValueChange={(value) => setFormData({ ...formData, ref3Title: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Full name"
                value={formData.ref3Name}
                onChange={(e) => setFormData({ ...formData, ref3Name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Phone Number <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.ref3Phone}
                  onChange={(e) => setFormData({ ...formData, ref3Phone: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Email <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="referee@example.com"
                  value={formData.ref3Email}
                  onChange={(e) => setFormData({ ...formData, ref3Email: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Position</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Job title"
                  value={formData.ref3Position}
                  onChange={(e) => setFormData({ ...formData, ref3Position: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-900 font-semibold mb-2 block">Current Employer</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Company name"
                  value={formData.ref3Employer}
                  onChange={(e) => setFormData({ ...formData, ref3Employer: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HR Contact Section */}
      <div className="bg-gray-700 text-white p-4 rounded-t-lg mt-8">
        <h3 className="font-bold text-lg">HR Contact from Current Employment</h3>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-b-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Title</Label>
            <Select value={formData.hrTitle} onValueChange={(value) => setFormData({ ...formData, hrTitle: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr.">Mr.</SelectItem>
                <SelectItem value="Mrs.">Mrs.</SelectItem>
                <SelectItem value="Ms.">Ms.</SelectItem>
                <SelectItem value="Dr.">Dr.</SelectItem>
                <SelectItem value="Prof.">Prof.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Name</Label>
            <Input
              placeholder="HR contact name"
              value={formData.hrName}
              onChange={(e) => setFormData({ ...formData, hrName: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.hrPhone}
                onChange={(e) => setFormData({ ...formData, hrPhone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="hr@company.com"
                value={formData.hrEmail}
                onChange={(e) => setFormData({ ...formData, hrEmail: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Current Position</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Job title"
                value={formData.hrPosition}
                onChange={(e) => setFormData({ ...formData, hrPosition: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">Current Employer</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Company name"
                value={formData.hrEmployer}
                onChange={(e) => setFormData({ ...formData, hrEmployer: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* File Uploads Section */}
      <div className="bg-gray-700 text-white p-4 rounded-t-lg mt-8">
        <h3 className="font-bold text-lg">Required Documents</h3>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-b-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Resume/CV <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, resume: file });
                }}
                required
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
          </div>
          <div>
            <Label className="text-gray-900 font-semibold mb-2 block">
              Cover Letter/Suitability Statement
            </Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, coverLetter: file });
                }}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
