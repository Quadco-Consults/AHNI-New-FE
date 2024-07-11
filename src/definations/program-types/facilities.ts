export interface FacilityData {
  id: string;
  name: string;
  state: string;
  local_govt: string;
  facility_contacts: [
    {
      id: string;
      name: string;
      position: string;
      phone_number: string;
      email: string;
      facility: string;
    }
  ];
}

export interface FacilityResponse {
  message: string;
  data: FacilityData[];
}
