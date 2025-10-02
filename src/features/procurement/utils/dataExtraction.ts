/**
 * Utility functions for safe data extraction from procurement tracker API responses
 */

/**
 * Safely extract field value with proper fallbacks
 */
export const getFieldValue = (value: any, fallback: string = "Not assigned"): string => {
  // Handle null, undefined, empty string, and "null" string
  if (value === null || value === undefined || value === "" || value === "null") {
    return fallback;
  }

  // Handle objects that should be strings
  if (typeof value === 'object' && value !== null) {
    return fallback;
  }

  return String(value);
};

/**
 * Display value with context-specific fallbacks
 */
export const displayValue = (value: any, fieldType: 'officer' | 'reference' | 'category' | 'general' = 'general'): string => {
  if (value === null || value === undefined || value === "" || value === "null") {
    switch (fieldType) {
      case 'officer':
        return "Not assigned";
      case 'reference':
        return "N/A";
      case 'category':
        return "Not categorized";
      default:
        return "Not specified";
    }
  }
  return String(value);
};

/**
 * Extract nested object values safely
 */
export const getNestedValue = (obj: any, path: string, fallback: string = "Not specified"): string => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[key];
  }

  return getFieldValue(current, fallback);
};

/**
 * Try multiple paths to extract data (fallback chain)
 */
export const tryMultiplePaths = (obj: any, paths: string[], fallback: string = "Not specified"): string => {
  for (const path of paths) {
    const value = getNestedValue(obj, path, null);
    if (value !== null && value !== "Not specified") {
      return value;
    }
  }
  return fallback;
};

/**
 * Format currency values
 */
export const formatCurrencyValue = (value: any, currency: string = "₦"): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "N/A";

  return `${currency}${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date values
 */
export const formatDateValue = (value: any): string => {
  if (!value || value === "null") return "N/A";

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US");
  } catch {
    return "N/A";
  }
};

/**
 * Extract donor information from various possible sources
 */
export const extractDonor = (item: any): string => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.item_detail?.donor?.name) {
      return firstItem.item_detail.donor.name;
    }
  }

  // Handle other formats
  return tryMultiplePaths(item, [
    'purchase_request.donor.name',
    'purchase_request.donor',
    'donor.name',
    'donor',
    'funding_source.donor.name',
    'funding_source.donor',
    'workplan_activity.project.donor.name'
  ], "Not specified");
};

/**
 * Extract project information from various possible sources
 */
export const extractProject = (item: any): string => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.item_detail?.project?.title) {
      return firstItem.item_detail.project.title;
    }
  }

  // Handle other formats
  return tryMultiplePaths(item, [
    'purchase_request.project.title',
    'purchase_request.project.name',
    'purchase_request.project',
    'project.title',
    'project.name',
    'project',
    'workplan_activity.project.title',
    'workplan_activity.project.name'
  ], "Not specified");
};

/**
 * Extract procurement officer information
 */
export const extractProcurementOfficer = (item: any): string => {
  // Handle Purchase Request format - requested_by_detail
  if (item.requested_by_detail?.name) {
    return item.requested_by_detail.name;
  }

  // Handle other formats
  return tryMultiplePaths(item, [
    'purchase_request.procurement_officer.full_name',
    'purchase_request.procurement_officer.first_name',
    'purchase_request.procurement_officer.name',
    'purchase_request.procurement_officer',
    'procurement_officer.full_name',
    'procurement_officer.first_name',
    'procurement_officer.name',
    'procurement_officer',
    'officer_name',
    'pr_staff'
  ], "Not assigned");
};

/**
 * Extract purchase order information
 */
export const extractPOValue = (item: any): string => {
  // Handle Purchase Request format - total_cost
  if (item.total_cost) {
    return formatCurrencyValue(item.total_cost);
  }

  const value = tryMultiplePaths(item, [
    'purchase_order.total_price',
    'purchase_order.sub_total_amount',
    'purchase_order.total_amount',
    'total_price',
    'sub_total_amount',
    'total_amount'
  ], null);

  if (value === null || value === "Not specified") return "N/A";
  return formatCurrencyValue(value);
};

/**
 * Extract vendor information
 */
export const extractVendor = (item: any): string => {
  // Handle Purchase Request format - no vendor info at this stage
  // Purchase requests don't have vendor info yet

  return tryMultiplePaths(item, [
    'purchase_order.vendor.name',
    'purchase_order.vendor',
    'vendor.name',
    'vendor',
    'supplier.name',
    'supplier'
  ], "Not assigned");
};

/**
 * Extract PR reference
 */
export const extractPRReference = (item: any): string => {
  // Handle Purchase Request format - ref_number
  if (item.ref_number) {
    return item.ref_number;
  }

  // Handle other formats
  return tryMultiplePaths(item, [
    'purchase_request.pr_reference',
    'purchase_request.reference',
    'pr_reference',
    'reference',
    'pr_id'
  ], "N/A");
};

/**
 * Extract department information from Purchase Request format
 */
export const extractDepartment = (item: any): string => {
  // Handle Purchase Request format
  if (item.requesting_department_detail?.name) {
    return item.requesting_department_detail.name;
  }

  // Handle other formats
  return getFieldValue(item.deparment) ||
         getFieldValue(item.department) ||
         getNestedValue(item, 'department.name') ||
         getFieldValue(item.office, 'N/A');
};

/**
 * Extract location/office information from Purchase Request format
 */
export const extractLocation = (item: any): string => {
  // Handle Purchase Request format
  if (item.location_detail?.name) {
    return item.location_detail.name;
  }

  // Handle other formats
  return getNestedValue(item, 'purchase_request.location') ||
         getNestedValue(item, 'purchase_request.office') ||
         getFieldValue(item.location) ||
         getFieldValue(item.office) ||
         getFieldValue(item.implementation_location, 'N/A');
};

/**
 * Extract item name from Purchase Request format
 */
export const extractItemName = (item: any): string => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.item_detail?.name) {
      return firstItem.item_detail.name;
    }
  }

  // Handle other formats
  return getNestedValue(item, 'purchase_request.item_name') ||
         getNestedValue(item, 'purchase_request.description') ||
         getFieldValue(item.item_name) ||
         getFieldValue(item.description) ||
         getFieldValue(item.name, 'N/A');
};

/**
 * Extract item category from Purchase Request format
 */
export const extractItemCategory = (item: any): string => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.item_detail?.category?.name) {
      return firstItem.item_detail.category.name;
    }
  }

  // Handle other formats
  return getNestedValue(item, 'purchase_request.item_category') ||
         getFieldValue(item.item_category) ||
         getNestedValue(item, 'category.name') ||
         getFieldValue(item.category, 'Not categorized');
};

/**
 * Extract quantity from Purchase Request format
 */
export const extractQuantity = (item: any): number => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.quantity) {
      return Number(firstItem.quantity);
    }
  }

  // Handle other formats
  const qty = getNestedValue(item, 'purchase_order.quantity') ||
             getNestedValue(item, 'purchase_request.quantity') ||
             getFieldValue(item.quantity) ||
             getFieldValue(item.qty, 0);

  return Number(qty || 0);
};

/**
 * Extract unit cost from Purchase Request format
 */
export const extractUnitCost = (item: any): string => {
  // Handle Purchase Request format (items array)
  if (item.items && Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    if (firstItem.unit_cost) {
      return formatCurrencyValue(firstItem.unit_cost);
    }
  }

  return 'N/A';
};

/**
 * Extract total amount from Purchase Request format
 */
export const extractTotalAmount = (item: any): string => {
  // Handle Purchase Request format - total_cost
  if (item.total_cost && Number(item.total_cost) > 0) {
    return formatCurrencyValue(item.total_cost);
  }

  // Handle items array sum
  if (item.items && Array.isArray(item.items)) {
    const total = item.items.reduce((sum: number, i: any) => {
      const amount = Number(i.amount) || 0;
      return sum + amount;
    }, 0);

    if (total > 0) {
      return formatCurrencyValue(total);
    }
  }

  return 'N/A';
};

// ===== SOLICITATION/RFQ EXTRACTION FUNCTIONS =====

/**
 * Extract RFQ reference from Solicitation format
 */
export const extractRFQReference = (item: any): string => {
  // Handle Solicitation format
  if (item.rfq_id) {
    return item.rfq_id;
  }

  // Fallback to other possible fields
  return getFieldValue(item.reference) ||
         getFieldValue(item.solicitation_ref) ||
         getFieldValue(item.id, 'N/A');
};

/**
 * Extract solicitation title
 */
export const extractSolicitationTitle = (item: any): string => {
  return getFieldValue(item.title, 'Untitled Solicitation');
};

/**
 * Extract solicitation status
 */
export const extractSolicitationStatus = (item: any): string => {
  return getFieldValue(item.status, 'Unknown');
};

/**
 * Extract tender type
 */
export const extractTenderType = (item: any): string => {
  return getFieldValue(item.tender_type, 'Not specified');
};

/**
 * Extract request type (RFQ/RFP)
 */
export const extractRequestType = (item: any): string => {
  return getFieldValue(item.request_type, 'Not specified');
};

/**
 * Extract procurement type from Solicitation
 */
export const extractProcurementType = (item: any): string => {
  return getFieldValue(item.procurement_type, 'Not specified');
};

/**
 * Extract opening date from Solicitation
 */
export const extractOpeningDate = (item: any): string => {
  return formatDateValue(item.opening_date);
};

/**
 * Extract closing date from Solicitation
 */
export const extractClosingDate = (item: any): string => {
  return formatDateValue(item.closing_date);
};

/**
 * Extract donor information from Solicitation items
 */
export const extractSolicitationDonor = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.item_detail?.donor?.name) {
      return firstItem.item_detail.donor.name;
    }
  }

  // Fallback to other extraction methods
  return extractDonor(item);
};

/**
 * Extract project information from Solicitation items
 */
export const extractSolicitationProject = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.item_detail?.project?.title) {
      return firstItem.item_detail.project.title;
    }
  }

  // Fallback to other extraction methods
  return extractProject(item);
};

/**
 * Extract item name from Solicitation items
 */
export const extractSolicitationItemName = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.item_detail?.name) {
      return firstItem.item_detail.name;
    }
    if (firstItem.description) {
      return firstItem.description;
    }
  }

  // Fallback to title or other methods
  return getFieldValue(item.title) || extractItemName(item);
};

/**
 * Extract item category from Solicitation items
 */
export const extractSolicitationItemCategory = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.item_detail?.category?.name) {
      return firstItem.item_detail.category.name;
    }
  }

  // Fallback to other extraction methods
  return extractItemCategory(item);
};

/**
 * Extract quantity from Solicitation items
 */
export const extractSolicitationQuantity = (item: any): number => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.quantity) {
      return Number(firstItem.quantity);
    }
  }

  // Fallback to other extraction methods
  return extractQuantity(item);
};

/**
 * Extract unit of measurement from Solicitation items
 */
export const extractSolicitationUOM = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.item_detail?.uom) {
      return firstItem.item_detail.uom;
    }
  }

  return 'N/A';
};

/**
 * Extract estimated value from Solicitation items
 */
export const extractSolicitationEstimatedValue = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const total = item.solicitation_items.reduce((sum: number, solItem: any) => {
      const price = Number(solItem.item_detail?.price) || 0;
      const quantity = Number(solItem.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    if (total > 0) {
      return formatCurrencyValue(total);
    }
  }

  return 'N/A';
};

/**
 * Extract specification from Solicitation items
 */
export const extractSolicitationSpecification = (item: any): string => {
  // Handle Solicitation format (solicitation_items array)
  if (item.solicitation_items && Array.isArray(item.solicitation_items) && item.solicitation_items.length > 0) {
    const firstItem = item.solicitation_items[0];
    if (firstItem.specification) {
      return firstItem.specification;
    }
  }

  return getFieldValue(item.background, 'No specification provided');
};

// ===== SMART DATA FORMAT DETECTION =====

/**
 * Detect data format type
 */
export const detectDataFormat = (item: any): 'purchase_request' | 'solicitation' | 'unknown' => {
  // Check for Purchase Request indicators
  if (item.items && Array.isArray(item.items)) {
    return 'purchase_request';
  }

  // Check for Solicitation indicators
  if (item.solicitation_items && Array.isArray(item.solicitation_items)) {
    return 'solicitation';
  }

  // Additional checks
  if (item.ref_number || item.requesting_department_detail) {
    return 'purchase_request';
  }

  if (item.rfq_id || item.tender_type || item.request_type) {
    return 'solicitation';
  }

  return 'unknown';
};

/**
 * Smart extraction that detects format and uses appropriate function
 */
export const smartExtractReference = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractPRReference(item);
    case 'solicitation':
      return extractRFQReference(item);
    default:
      return extractPRReference(item); // Fallback
  }
};

/**
 * Smart extraction for item name
 */
export const smartExtractItemName = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractItemName(item);
    case 'solicitation':
      return extractSolicitationItemName(item);
    default:
      return extractItemName(item); // Fallback
  }
};

/**
 * Smart extraction for donor
 */
export const smartExtractDonor = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractDonor(item);
    case 'solicitation':
      return extractSolicitationDonor(item);
    default:
      return extractDonor(item); // Fallback
  }
};

/**
 * Smart extraction for project
 */
export const smartExtractProject = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractProject(item);
    case 'solicitation':
      return extractSolicitationProject(item);
    default:
      return extractProject(item); // Fallback
  }
};

/**
 * Smart extraction for category
 */
export const smartExtractCategory = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractItemCategory(item);
    case 'solicitation':
      return extractSolicitationItemCategory(item);
    default:
      return extractItemCategory(item); // Fallback
  }
};

/**
 * Smart extraction for quantity
 */
export const smartExtractQuantity = (item: any): number => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      return extractQuantity(item);
    case 'solicitation':
      return extractSolicitationQuantity(item);
    default:
      return extractQuantity(item); // Fallback
  }
};

/**
 * Smart extraction for UOM
 */
export const smartExtractUOM = (item: any): string => {
  const format = detectDataFormat(item);

  switch (format) {
    case 'purchase_request':
      // Purchase Request format - get UOM from first item's item_detail
      if (item.items && Array.isArray(item.items) && item.items.length > 0) {
        const firstItem = item.items[0];
        return firstItem.item_detail?.uom || 'N/A';
      }
      return 'N/A';
    case 'solicitation':
      return extractSolicitationUOM(item);
    default:
      return 'N/A';
  }
};

// ===== PROCUREMENT LIFECYCLE RELATIONSHIP FUNCTIONS =====

/**
 * Extract procurement stage based on available data
 */
export const extractProcurementStage = (item: any): string => {
  // Check for GRN (final stage)
  if (item.grn_details || item.date_of_grn || item.purchase_order?.grn_details) {
    return 'GRN_COMPLETED';
  }

  // Check for Purchase Order
  if (item.purchase_order || item.po_reference || item.po_date) {
    return 'PO_ISSUED';
  }

  // Check for Solicitation/RFQ
  if (item.solicitation_items || item.rfq_id || item.tender_type) {
    return 'SOLICITATION_ACTIVE';
  }

  // Check for Purchase Request
  if (item.items || item.ref_number || item.requesting_department_detail) {
    return 'PR_CREATED';
  }

  return 'UNKNOWN';
};

/**
 * Extract related PR reference from any stage
 */
export const extractRelatedPRReference = (item: any): string => {
  // Direct PR reference
  if (item.ref_number) {
    return item.ref_number;
  }

  // From Solicitation that references PR
  if (item.purchase_request) {
    return item.purchase_request; // This might be just an ID, would need to lookup
  }

  // From PO that might reference PR
  if (item.purchase_order?.purchase_request) {
    return item.purchase_order.purchase_request;
  }

  // Fallback patterns
  return getFieldValue(item.pr_reference) ||
         getFieldValue(item.purchase_request_ref) ||
         'N/A';
};

/**
 * Extract related RFQ/Solicitation reference
 */
export const extractRelatedRFQReference = (item: any): string => {
  // Direct RFQ reference
  if (item.rfq_id) {
    return item.rfq_id;
  }

  // From PO that references RFQ
  if (item.purchase_order?.rfq_reference || item.purchase_order?.solicitation) {
    return item.purchase_order.rfq_reference || item.purchase_order.solicitation;
  }

  // From related solicitation
  if (item.solicitation?.rfq_id) {
    return item.solicitation.rfq_id;
  }

  return getFieldValue(item.solicitation_ref) ||
         getFieldValue(item.rfq_reference) ||
         'N/A';
};

/**
 * Extract related PO reference
 */
export const extractRelatedPOReference = (item: any): string => {
  // Direct PO reference
  if (item.po_reference) {
    return item.po_reference;
  }

  // From purchase_order object
  if (item.purchase_order?.po_reference || item.purchase_order?.reference) {
    return item.purchase_order.po_reference || item.purchase_order.reference;
  }

  // From GRN that references PO
  if (item.grn_details?.po_reference) {
    return item.grn_details.po_reference;
  }

  return getFieldValue(item.purchase_order_ref) ||
         'N/A';
};

/**
 * Extract GRN reference
 */
export const extractGRNReference = (item: any): string => {
  return getFieldValue(item.grn_reference) ||
         getFieldValue(item.grn_number) ||
         getNestedValue(item, 'grn_details.grn_number') ||
         getNestedValue(item, 'purchase_order.grn_details.grn_number') ||
         'N/A';
};

/**
 * Get procurement status with stage information
 */
export const extractProcurementStatus = (item: any): { stage: string; status: string; label: string } => {
  const stage = extractProcurementStage(item);

  switch (stage) {
    case 'GRN_COMPLETED':
      return {
        stage: 'GRN_COMPLETED',
        status: 'COMPLETED',
        label: 'Goods Received'
      };
    case 'PO_ISSUED':
      const poStatus = getFieldValue(item.purchase_order?.status) ||
                      getFieldValue(item.po_status) ||
                      'PENDING_DELIVERY';
      return {
        stage: 'PO_ISSUED',
        status: poStatus,
        label: `PO ${poStatus.replace('_', ' ').toLowerCase()}`
      };
    case 'SOLICITATION_ACTIVE':
      const solicitationStatus = getFieldValue(item.status) || 'OPEN';
      return {
        stage: 'SOLICITATION_ACTIVE',
        status: solicitationStatus,
        label: `RFQ ${solicitationStatus.toLowerCase()}`
      };
    case 'PR_CREATED':
      const prStatus = getFieldValue(item.status) || 'PENDING';
      return {
        stage: 'PR_CREATED',
        status: prStatus,
        label: `PR ${prStatus.toLowerCase()}`
      };
    default:
      return {
        stage: 'UNKNOWN',
        status: 'UNKNOWN',
        label: 'Unknown stage'
      };
  }
};

/**
 * Get complete procurement timeline
 */
export const extractProcurementTimeline = (item: any): Array<{
  stage: string;
  reference: string;
  date: string;
  status: string;
  completed: boolean;
}> => {
  const timeline = [];

  // PR Stage
  const prRef = extractRelatedPRReference(item);
  if (prRef !== 'N/A') {
    timeline.push({
      stage: 'Purchase Request',
      reference: prRef,
      date: formatDateValue(item.date_of_request || item.request_date || item.created_at),
      status: getFieldValue(item.status, 'Created'),
      completed: true
    });
  }

  // RFQ Stage
  const rfqRef = extractRelatedRFQReference(item);
  if (rfqRef !== 'N/A') {
    timeline.push({
      stage: 'RFQ/Solicitation',
      reference: rfqRef,
      date: formatDateValue(item.opening_date || item.solicitation?.opening_date),
      status: getFieldValue(item.status || item.solicitation?.status, 'Active'),
      completed: item.status === 'CLOSED' || item.solicitation?.status === 'CLOSED'
    });
  }

  // PO Stage
  const poRef = extractRelatedPOReference(item);
  if (poRef !== 'N/A') {
    timeline.push({
      stage: 'Purchase Order',
      reference: poRef,
      date: formatDateValue(item.po_date || item.purchase_order?.po_date),
      status: getFieldValue(item.purchase_order?.status, 'Issued'),
      completed: true
    });
  }

  // GRN Stage
  const grnRef = extractGRNReference(item);
  if (grnRef !== 'N/A') {
    timeline.push({
      stage: 'Goods Receipt',
      reference: grnRef,
      date: formatDateValue(item.date_of_grn || item.purchase_order?.date_of_grn),
      status: 'Received',
      completed: true
    });
  }

  return timeline;
};

/**
 * Smart extraction that shows the primary reference based on current stage
 */
export const smartExtractPrimaryReference = (item: any): string => {
  const stage = extractProcurementStage(item);

  switch (stage) {
    case 'GRN_COMPLETED':
      return extractGRNReference(item);
    case 'PO_ISSUED':
      return extractRelatedPOReference(item);
    case 'SOLICITATION_ACTIVE':
      return extractRFQReference(item);
    case 'PR_CREATED':
      return extractPRReference(item);
    default:
      return smartExtractReference(item);
  }
};

/**
 * Get procurement progress percentage
 */
export const extractProcurementProgress = (item: any): number => {
  const stage = extractProcurementStage(item);

  switch (stage) {
    case 'GRN_COMPLETED':
      return 100;
    case 'PO_ISSUED':
      return 75;
    case 'SOLICITATION_ACTIVE':
      return 50;
    case 'PR_CREATED':
      return 25;
    default:
      return 0;
  }
};

/**
 * Extract all related references for cross-reference tracking
 */
export const extractRelatedReferences = (item: any): {
  pr: string | null;
  rfq: string | null;
  po: string | null;
  grn: string | null;
} => {
  const prRef = extractRelatedPRReference(item);
  const rfqRef = extractRelatedRFQReference(item);
  const poRef = extractRelatedPOReference(item);
  const grnRef = extractGRNReference(item);

  return {
    pr: prRef !== 'N/A' ? prRef : null,
    rfq: rfqRef !== 'N/A' ? rfqRef : null,
    po: poRef !== 'N/A' ? poRef : null,
    grn: grnRef !== 'N/A' ? grnRef : null
  };
};