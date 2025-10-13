import { TCreateUserFormValues } from "@/features/auth/types/user";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

/**
 * Create user account from consultant/facilitator/adhoc applicant data
 *
 * This utility automatically creates a user account when an applicant accepts their contract.
 * It maps applicant data to the user creation format required by the system.
 *
 * @param applicantData - The applicant/consultant data from the acceptance process
 * @param userType - Type of user: "CONSULTANT", "FACILITATOR", or "ADHOC_STAFF"
 * @param defaultRoleId - Optional default role ID to assign to the user
 * @returns Promise with the created user data
 *
 * @example
 * // After consultant accepts contract
 * await createUserAccountFromApplicant(applicantData, "CONSULTANT");
 *
 * // With specific role
 * await createUserAccountFromApplicant(applicantData, "FACILITATOR", "role-id-123");
 */
export async function createUserAccountFromApplicant(
  applicantData: any,
  userType: "CONSULTANT" | "FACILITATOR" | "ADHOC_STAFF",
  defaultRoleId?: string
) {
  try {
    console.log("🔐 Creating user account for applicant:", {
      name: applicantData.name,
      email: applicantData.email,
      userType
    });

    // Extract names (handle various name formats)
    const fullName = applicantData.name || '';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // If no last name, use first name

    // Prepare user creation data
    const userData: TCreateUserFormValues = {
      first_name: firstName,
      last_name: lastName,
      email: applicantData.email,
      mobile_number: applicantData.phone || applicantData.mobile || applicantData.contact || '',
      gender: mapGender(applicantData.gender),
      location: applicantData.location || applicantData.acceptance_country || '',
      state: applicantData.state || applicantData.acceptance_city || '',
      address: applicantData.address || '',
      department: applicantData.department || getDepartmentForUserType(userType),
      position: applicantData.position_under_contract || applicantData.position || userType.replace('_', ' '),
      user_type: userType,
      roles: defaultRoleId ? [defaultRoleId] : [],
    };

    console.log("📤 Sending user creation request:", userData);

    // Create user via API
    const response = await AxiosWithToken.post("users/", userData);

    console.log("✅ User account created successfully:", response.data);

    return {
      success: true,
      data: response.data,
      userId: response.data?.data?.id,
    };

  } catch (error: any) {
    console.error("❌ Failed to create user account:", error);

    // Check if user already exists
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
        console.log("ℹ️  User account already exists for this email");
        return {
          success: false,
          error: "User account already exists",
          userExists: true,
        };
      }
    }

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to create user account"
    );
  }
}

/**
 * Map applicant gender to system gender enum
 */
function mapGender(gender?: string): "MALE" | "FEMALE" | "Other" {
  if (!gender) return "Other";

  const normalizedGender = gender.toUpperCase();

  if (normalizedGender === "MALE" || normalizedGender === "M") {
    return "MALE";
  }

  if (normalizedGender === "FEMALE" || normalizedGender === "F") {
    return "FEMALE";
  }

  return "Other";
}

/**
 * Get default department based on user type
 */
function getDepartmentForUserType(userType: string): string {
  switch (userType) {
    case "CONSULTANT":
      return "Contracts & Grants";
    case "FACILITATOR":
      return "Programs";
    case "ADHOC_STAFF":
      return "Programs";
    default:
      return "General";
  }
}

/**
 * Batch create user accounts for multiple applicants
 * Useful when importing historical data or bulk onboarding
 */
export async function batchCreateUserAccounts(
  applicants: any[],
  userType: "CONSULTANT" | "FACILITATOR" | "ADHOC_STAFF",
  defaultRoleId?: string
) {
  const results = {
    created: [] as any[],
    failed: [] as any[],
    existing: [] as any[],
  };

  console.log(`🔄 Batch creating ${applicants.length} user accounts for ${userType}...`);

  for (const applicant of applicants) {
    try {
      const result = await createUserAccountFromApplicant(applicant, userType, defaultRoleId);

      if (result.success) {
        results.created.push({
          email: applicant.email,
          name: applicant.name,
          userId: result.userId,
        });
      } else if (result.userExists) {
        results.existing.push({
          email: applicant.email,
          name: applicant.name,
        });
      }
    } catch (error: any) {
      results.failed.push({
        email: applicant.email,
        name: applicant.name,
        error: error.message,
      });
    }
  }

  console.log("✅ Batch user creation completed:", {
    created: results.created.length,
    existing: results.existing.length,
    failed: results.failed.length,
  });

  return results;
}
