/**
 * Normalizes leave request data from the backend
 * Backend returns employee_detail with legal_firstname, legal_lastname, serial_id_code
 * Frontend expects employee with first_name, last_name, employee_id
 */
export const normalizeLeaveRequestEmployee = (request: any) => {
  if (!request) return request;

  // If employee_detail exists, map it to employee with normalized field names
  if (request.employee_detail) {
    // Extract department - from user.department if employee_detail.department is null
    let department = null;
    if (request.employee_detail.department) {
      department = typeof request.employee_detail.department === 'object'
        ? request.employee_detail.department?.name
        : request.employee_detail.department;
    } else if (request.employee_detail.user?.department) {
      department = typeof request.employee_detail.user.department === 'object'
        ? request.employee_detail.user.department?.name
        : request.employee_detail.user.department;
    }

    // Extract position - from position or designation object
    let position = null;
    const positionObj = request.employee_detail.position || request.employee_detail.designation;
    if (positionObj) {
      position = typeof positionObj === 'object'
        ? positionObj?.name || positionObj?.title
        : positionObj;
    }

    // Extract location - from location or address or project
    let location = null;
    if (request.employee_detail.location) {
      location = typeof request.employee_detail.location === 'object'
        ? request.employee_detail.location?.name
        : request.employee_detail.location;
    } else if (request.employee_detail.address) {
      location = request.employee_detail.address;
    } else if (request.employee_detail.project) {
      location = typeof request.employee_detail.project === 'object'
        ? request.employee_detail.project?.name
        : request.employee_detail.project;
    }

    // Extract employee name - prefer user.full_name, fallback to legal_firstname/legal_lastname
    let firstName = request.employee_detail.legal_firstname;
    let lastName = request.employee_detail.legal_lastname;

    if (request.employee_detail.user?.full_name) {
      const nameParts = request.employee_detail.user.full_name.trim().split(' ');
      if (nameParts.length > 1) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      } else {
        firstName = request.employee_detail.user.full_name;
        lastName = '';
      }
    }

    return {
      ...request,
      employee: {
        id: request.employee_detail.id || request.employee,
        first_name: firstName,
        last_name: lastName,
        email: request.employee_detail.email,
        employee_id: request.employee_detail.serial_id_code,
        department: department || 'N/A',
        position: position || 'N/A',
        location: location || 'N/A',
        full_name: request.employee_detail.user?.full_name || request.employee_detail.full_name,
      },
    };
  }

  // If employee is already an object with first_name, return as is
  if (request.employee && typeof request.employee === 'object' && request.employee.first_name) {
    return request;
  }

  // If employee is just a UUID string, keep it as is (will show as N/A in UI)
  return request;
};

/**
 * Normalizes leave balance data from the backend
 * Backend may return leave_package instead of leaveType
 * Maps snake_case fields to camelCase where needed
 */
export const normalizeLeaveBalance = (balance: any) => {
  if (!balance) return balance;

  // Backend returns leave_package, frontend expects leaveType
  const leaveTypeData = balance.leave_package || balance.leaveType || balance.leave_type;

  if (!leaveTypeData) {
    console.warn("Leave balance missing leave type data:", balance);
    return null;
  }

  // Extract leave type with safe defaults
  const leaveType = {
    id: leaveTypeData.id || '',
    name: leaveTypeData.name || 'Unknown Leave Type',
    description: leaveTypeData.description || '',
    color: leaveTypeData.color || '#999999',
    maxConsecutiveDays: leaveTypeData.max_consecutive_days || leaveTypeData.maxConsecutiveDays || null,
    allowCarryForward: leaveTypeData.allow_carry_forward ?? leaveTypeData.allowCarryForward ?? false,
    carryForwardLimit: leaveTypeData.carry_forward_limit || leaveTypeData.carryForwardLimit || null,
    advanceNoticeDays: leaveTypeData.advance_notice_days || leaveTypeData.advanceNoticeDays || 0,
    requiresApproval: leaveTypeData.requires_approval ?? leaveTypeData.requiresApproval ?? true,
    paidLeave: leaveTypeData.paid_leave ?? leaveTypeData.paidLeave ?? true,
  };

  return {
    id: balance.id || '',
    employeeId: balance.employee || balance.employee_id || balance.employeeId || '',
    leaveTypeId: leaveTypeData.id || balance.leave_package || balance.leave_type_id || '',
    leaveType: leaveType,
    year: balance.year || new Date().getFullYear(),
    entitled: balance.entitled_days ?? balance.entitled ?? 0,
    used: balance.used_days ?? balance.used ?? 0,
    pending: balance.pending_days ?? balance.pending ?? 0,
    scheduled: balance.scheduled_days ?? balance.scheduled ?? 0,
    available: balance.available_days ?? balance.available ?? 0,
    carriedForward: balance.carried_forward_days ?? balance.carriedForward ?? balance.carried_forward ?? 0,
    lastUpdated: balance.last_updated || balance.lastUpdated || balance.updated_at || new Date().toISOString(),
  };
};
