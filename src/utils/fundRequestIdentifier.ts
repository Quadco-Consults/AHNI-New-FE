/**
 * Fund Request Unique Identifier Generator
 * Format: {PROJECT_ID}-{LOCATION_CODE}-{YEAR}-{MONTH}-{SEQUENCE}
 * Example: ACE1-1001000-ASO-25-11-01
 */

export interface FundRequestIdentifierParams {
  projectId: string;
  locationCode: string;
  year?: number;
  month?: number;
  sequence?: number;
}

export interface LocationData {
  id: string;
  name: string;
  unique_code?: string;
  code?: string;
  state?: string;
}

export interface ProjectData {
  id: string;
  project_id: string;
  title: string;
}

/**
 * Generate fund request unique identifier
 */
export const generateFundRequestIdentifier = ({
  projectId,
  locationCode,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  sequence = 1
}: FundRequestIdentifierParams): string => {
  // Format year as 2 digits (e.g., 2025 -> 25)
  const yearSuffix = String(year).slice(-2);

  // Format month as 2 digits (e.g., 1 -> 01, 11 -> 11)
  const monthFormatted = String(month).padStart(2, '0');

  // Format sequence as 2 digits (e.g., 1 -> 01, 15 -> 15)
  const sequenceFormatted = String(sequence).padStart(2, '0');

  return `${projectId}-${locationCode}-${yearSuffix}-${monthFormatted}-${sequenceFormatted}`;
};

/**
 * Parse fund request identifier to get components
 */
export const parseFundRequestIdentifier = (identifier: string) => {
  const parts = identifier.split('-');

  if (parts.length < 5) {
    throw new Error('Invalid fund request identifier format');
  }

  // Find the last 3 parts (year, month, sequence) and join the rest as project ID
  const sequence = parts[parts.length - 1];
  const month = parts[parts.length - 2];
  const year = parts[parts.length - 3];
  const locationCode = parts[parts.length - 4];

  // Everything before the location code is the project ID
  const projectId = parts.slice(0, parts.length - 4).join('-');

  return {
    projectId,
    locationCode,
    year: parseInt(`20${year}`), // Convert 25 back to 2025
    month: parseInt(month),
    sequence: parseInt(sequence)
  };
};

/**
 * Extract location code from location data
 * Handles multiple possible field names for location code
 */
export const getLocationCode = (location: LocationData): string => {
  // Priority: code > unique_code > first 3 letters of name
  if (location.code) {
    return location.code.toUpperCase();
  }

  if (location.unique_code) {
    // Remove any non-alphanumeric characters and convert to uppercase
    return location.unique_code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }

  // Fallback: use first 3 letters of location name
  return location.name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
};

/**
 * Generate location code from state and location name
 * Example: "Adamawa State Office" -> "ASO"
 */
export const generateLocationCodeFromName = (locationName: string): string => {
  // Split by spaces and take first letter of each word
  const words = locationName.split(' ').filter(word => word.length > 0);

  if (words.length === 1) {
    // Single word: take first 3 letters
    return words[0].slice(0, 3).toUpperCase();
  }

  // Multiple words: take first letter of each word, up to 3 letters
  return words
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
};

/**
 * Validate fund request identifier format
 */
export const validateFundRequestIdentifier = (identifier: string): boolean => {
  // Pattern: PROJECT_ID-LOCATION_CODE-YY-MM-SS
  // PROJECT_ID can contain multiple parts separated by dashes
  // Must end with: LOCATION_CODE-YY-MM-SS (where YY, MM, SS are 2 digits each)
  const pattern = /^[A-Z0-9-]+-[A-Z0-9]+-\d{2}-\d{2}-\d{2}$/;
  return pattern.test(identifier);
};

/**
 * Get next sequence number for a given project, location, year, and month
 * This fetches existing fund requests and calculates the next sequence number
 */
export const getNextSequenceNumber = async (
  projectId: string,
  locationCode: string,
  year: number,
  month: number
): Promise<number> => {
  try {
    // Get the auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://127.0.0.1:8000/api/v1';

    console.log('Fetching existing fund requests to calculate next sequence for:', { projectId, locationCode, year, month });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Format the prefix we're looking for
    // Format: {PROJECT_ID}-{LOCATION_CODE}-{YY}-{MM}-
    const yearSuffix = String(year).slice(-2);
    const monthFormatted = String(month).padStart(2, '0');
    const searchPrefix = `${projectId}-${locationCode}-${yearSuffix}-${monthFormatted}`;

    console.log('Searching for fund requests with prefix:', searchPrefix);

    // Fetch all fund requests to find matching ones
    const response = await fetch(`${API_BASE_URL}/programs/fund-requests/?size=1000`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API call failed with status ${response.status}:`, errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const fundRequests = data?.data?.results || data?.results || [];

    console.log(`Found ${fundRequests.length} total fund requests`);

    // Find all fund requests with matching uuid_code prefix
    let maxSequence = 0;

    fundRequests.forEach((request: any) => {
      const uuidCode = request.uuid_code;
      if (uuidCode && uuidCode.startsWith(searchPrefix)) {
        console.log('Found matching fund request:', uuidCode);

        // Extract the sequence number (last part after the last dash)
        const parts = uuidCode.split('-');
        const sequencePart = parts[parts.length - 1];
        const sequenceNum = parseInt(sequencePart, 10);

        if (!isNaN(sequenceNum) && sequenceNum > maxSequence) {
          maxSequence = sequenceNum;
        }
      }
    });

    const nextSequence = maxSequence + 1;
    console.log(`Max existing sequence: ${maxSequence}, Next sequence: ${nextSequence}`);

    return nextSequence;
  } catch (error) {
    console.error('Error getting next sequence number:', error);
    console.error('Request details:', { projectId, locationCode, year, month });
    // Fallback to 1 if API call fails
    console.warn('getNextSequenceNumber: Using fallback sequence number 1 due to API error.');
    console.warn('WARNING: This may result in duplicate reference numbers if the same location has multiple fund requests for the same period!');
    return 1;
  }
};

/**
 * Generate complete fund request identifier with automatic sequence
 */
export const generateFundRequestIdentifierAuto = async (
  projectData: ProjectData,
  locationData: LocationData,
  year?: number,
  month?: number
): Promise<string> => {
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;

  const projectId = projectData.project_id;
  const locationCode = getLocationCode(locationData);

  const sequence = await getNextSequenceNumber(
    projectId,
    locationCode,
    currentYear,
    currentMonth
  );

  return generateFundRequestIdentifier({
    projectId,
    locationCode,
    year: currentYear,
    month: currentMonth,
    sequence
  });
};

/**
 * Examples and test cases
 */
export const examples = {
  basic: generateFundRequestIdentifier({
    projectId: 'ACE1-1001000',
    locationCode: 'ASO',
    year: 2025,
    month: 11,
    sequence: 1
  }), // Returns: ACE1-1001000-ASO-25-11-01

  secondRequest: generateFundRequestIdentifier({
    projectId: 'ACE1-1001000',
    locationCode: 'ASO',
    year: 2025,
    month: 11,
    sequence: 2
  }), // Returns: ACE1-1001000-ASO-25-11-02

  differentLocation: generateFundRequestIdentifier({
    projectId: 'ACE1-1001000',
    locationCode: 'LSO',
    year: 2025,
    month: 11,
    sequence: 1
  }), // Returns: ACE1-1001000-LSO-25-11-01
};