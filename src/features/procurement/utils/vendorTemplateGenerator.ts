/**
 * Vendor Bulk Upload Template Generator
 *
 * Generates an Excel template for bulk vendor upload with:
 * - Pre-defined headers
 * - Sample data row
 * - Instructions sheet
 */

export interface VendorTemplateData {
  company_name: string;
  company_registration_number: string;
  tin: string;
  email: string;
  company_address: string;
  state: string;
  nature_of_business: string;
  area_of_specialization: string;
  key_staff_name_1?: string;
  key_staff_phone_1?: string;
  key_staff_email_1?: string;
  key_staff_name_2?: string;
  key_staff_phone_2?: string;
  key_staff_email_2?: string;
  key_staff_name_3?: string;
  key_staff_phone_3?: string;
  key_staff_email_3?: string;
  branch_address_1?: string;
  branch_address_2?: string;
  branch_address_3?: string;
}

export const VENDOR_TEMPLATE_HEADERS = [
  { key: 'company_name', label: 'Company Name *', required: true },
  { key: 'company_registration_number', label: 'RC Number *', required: true },
  { key: 'tin', label: 'Tax ID Number *', required: true },
  { key: 'email', label: 'Company Email *', required: true },
  { key: 'company_address', label: 'Main Office Address *', required: true },
  { key: 'state', label: 'State *', required: true },
  { key: 'nature_of_business', label: 'Products/Services *', required: true },
  { key: 'area_of_specialization', label: 'Area of Specialization *', required: true },
  { key: 'key_staff_name_1', label: 'Contact Person 1 - Name', required: false },
  { key: 'key_staff_phone_1', label: 'Contact Person 1 - Phone', required: false },
  { key: 'key_staff_email_1', label: 'Contact Person 1 - Email', required: false },
  { key: 'key_staff_name_2', label: 'Contact Person 2 - Name', required: false },
  { key: 'key_staff_phone_2', label: 'Contact Person 2 - Phone', required: false },
  { key: 'key_staff_email_2', label: 'Contact Person 2 - Email', required: false },
  { key: 'key_staff_name_3', label: 'Contact Person 3 - Name', required: false },
  { key: 'key_staff_phone_3', label: 'Contact Person 3 - Phone', required: false },
  { key: 'key_staff_email_3', label: 'Contact Person 3 - Email', required: false },
  { key: 'branch_address_1', label: 'Branch Address 1', required: false },
  { key: 'branch_address_2', label: 'Branch Address 2', required: false },
  { key: 'branch_address_3', label: 'Branch Address 3', required: false },
];

export const SAMPLE_VENDOR_DATA: VendorTemplateData = {
  company_name: 'ABC Company Ltd',
  company_registration_number: 'RC123456',
  tin: 'TIN987654321',
  email: 'info@abccompany.com',
  company_address: '123 Business Street, Lagos',
  state: 'Lagos',
  nature_of_business: 'IT Equipment and Services',
  area_of_specialization: 'Computer Hardware, Software, Networking',
  key_staff_name_1: 'John Doe',
  key_staff_phone_1: '+2348012345678',
  key_staff_email_1: 'john.doe@abccompany.com',
  key_staff_name_2: 'Jane Smith',
  key_staff_phone_2: '+2348098765432',
  key_staff_email_2: 'jane.smith@abccompany.com',
  branch_address_1: '456 Branch Road, Abuja',
};

/**
 * Generate CSV template for vendor bulk upload
 */
export const generateVendorTemplateCSV = (): string => {
  const headers = VENDOR_TEMPLATE_HEADERS.map(h => h.label).join(',');
  const sampleData = VENDOR_TEMPLATE_HEADERS.map(h => {
    const value = SAMPLE_VENDOR_DATA[h.key as keyof VendorTemplateData] || '';
    // Escape commas and quotes in CSV
    return `"${String(value).replace(/"/g, '""')}"`;
  }).join(',');

  return `${headers}\n${sampleData}`;
};

/**
 * Download CSV template
 */
export const downloadVendorTemplate = () => {
  const csv = generateVendorTemplateCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `vendor_upload_template_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parse uploaded CSV file
 */
export const parseVendorCSV = (file: File): Promise<VendorTemplateData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('File is empty or has no data rows'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const vendors: VendorTemplateData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const vendor: any = {};

          VENDOR_TEMPLATE_HEADERS.forEach((header, index) => {
            vendor[header.key] = values[index] || '';
          });

          vendors.push(vendor);
        }

        resolve(vendors);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Validate vendor data
 */
export const validateVendorData = (vendors: VendorTemplateData[]): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  vendors.forEach((vendor, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is headers

    VENDOR_TEMPLATE_HEADERS.forEach(header => {
      if (header.required && !vendor[header.key as keyof VendorTemplateData]) {
        errors.push(`Row ${rowNumber}: ${header.label} is required`);
      }
    });

    // Validate email format
    if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
      errors.push(`Row ${rowNumber}: Invalid email format`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
