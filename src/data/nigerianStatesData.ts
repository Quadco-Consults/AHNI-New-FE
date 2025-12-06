/**
 * Complete Nigerian States Data with Accurate Information
 * Source: Official Nigerian Government Data
 */

export interface NigerianStateData {
  name: string;
  code: string;
  capital: string;
  zone: string;
  lgas: number;
  is_active: boolean;
}

export const nigerianStatesData: NigerianStateData[] = [
  // North Central Zone
  {
    name: "Federal Capital Territory",
    code: "FCT",
    capital: "Abuja",
    zone: "North Central",
    lgas: 6,
    is_active: true,
  },
  {
    name: "Benue",
    code: "BN",
    capital: "Makurdi",
    zone: "North Central",
    lgas: 23,
    is_active: true,
  },
  {
    name: "Kogi",
    code: "KG",
    capital: "Lokoja",
    zone: "North Central",
    lgas: 21,
    is_active: true,
  },
  {
    name: "Kwara",
    code: "KW",
    capital: "Ilorin",
    zone: "North Central",
    lgas: 16,
    is_active: true,
  },
  {
    name: "Nasarawa",
    code: "NA",
    capital: "Lafia",
    zone: "North Central",
    lgas: 13,
    is_active: true,
  },
  {
    name: "Niger",
    code: "NI",
    capital: "Minna",
    zone: "North Central",
    lgas: 25,
    is_active: true,
  },
  {
    name: "Plateau",
    code: "PL",
    capital: "Jos",
    zone: "North Central",
    lgas: 17,
    is_active: true,
  },

  // North East Zone
  {
    name: "Adamawa",
    code: "AD",
    capital: "Yola",
    zone: "North East",
    lgas: 21,
    is_active: true,
  },
  {
    name: "Bauchi",
    code: "BA",
    capital: "Bauchi",
    zone: "North East",
    lgas: 20,
    is_active: true,
  },
  {
    name: "Borno",
    code: "BO",
    capital: "Maiduguri",
    zone: "North East",
    lgas: 27,
    is_active: true,
  },
  {
    name: "Gombe",
    code: "GO",
    capital: "Gombe",
    zone: "North East",
    lgas: 11,
    is_active: true,
  },
  {
    name: "Taraba",
    code: "TA",
    capital: "Jalingo",
    zone: "North East",
    lgas: 16,
    is_active: true,
  },
  {
    name: "Yobe",
    code: "YO",
    capital: "Damaturu",
    zone: "North East",
    lgas: 17,
    is_active: true,
  },

  // North West Zone
  {
    name: "Jigawa",
    code: "JI",
    capital: "Dutse",
    zone: "North West",
    lgas: 27,
    is_active: true,
  },
  {
    name: "Kaduna",
    code: "KD",
    capital: "Kaduna",
    zone: "North West",
    lgas: 23,
    is_active: true,
  },
  {
    name: "Kano",
    code: "KN",
    capital: "Kano",
    zone: "North West",
    lgas: 44,
    is_active: true,
  },
  {
    name: "Katsina",
    code: "KT",
    capital: "Katsina",
    zone: "North West",
    lgas: 34,
    is_active: true,
  },
  {
    name: "Kebbi",
    code: "KE",
    capital: "Birnin Kebbi",
    zone: "North West",
    lgas: 21,
    is_active: true,
  },
  {
    name: "Sokoto",
    code: "SO",
    capital: "Sokoto",
    zone: "North West",
    lgas: 23,
    is_active: true,
  },
  {
    name: "Zamfara",
    code: "ZA",
    capital: "Gusau",
    zone: "North West",
    lgas: 14,
    is_active: true,
  },

  // South East Zone
  {
    name: "Abia",
    code: "AB",
    capital: "Umuahia",
    zone: "South East",
    lgas: 17,
    is_active: true,
  },
  {
    name: "Anambra",
    code: "AN",
    capital: "Awka",
    zone: "South East",
    lgas: 21,
    is_active: true,
  },
  {
    name: "Ebonyi",
    code: "EB",
    capital: "Abakaliki",
    zone: "South East",
    lgas: 13,
    is_active: true,
  },
  {
    name: "Enugu",
    code: "EN",
    capital: "Enugu",
    zone: "South East",
    lgas: 17,
    is_active: true,
  },
  {
    name: "Imo",
    code: "IM",
    capital: "Owerri",
    zone: "South East",
    lgas: 27,
    is_active: true,
  },

  // South South Zone
  {
    name: "Akwa Ibom",
    code: "AK",
    capital: "Uyo",
    zone: "South South",
    lgas: 31,
    is_active: true,
  },
  {
    name: "Bayelsa",
    code: "BY",
    capital: "Yenagoa",
    zone: "South South",
    lgas: 8,
    is_active: true,
  },
  {
    name: "Cross River",
    code: "CR",
    capital: "Calabar",
    zone: "South South",
    lgas: 18,
    is_active: true,
  },
  {
    name: "Delta",
    code: "DE",
    capital: "Asaba",
    zone: "South South",
    lgas: 25,
    is_active: true,
  },
  {
    name: "Edo",
    code: "ED",
    capital: "Benin City",
    zone: "South South",
    lgas: 18,
    is_active: true,
  },
  {
    name: "Rivers",
    code: "RI",
    capital: "Port Harcourt",
    zone: "South South",
    lgas: 23,
    is_active: true,
  },

  // South West Zone
  {
    name: "Ekiti",
    code: "EK",
    capital: "Ado Ekiti",
    zone: "South West",
    lgas: 16,
    is_active: true,
  },
  {
    name: "Lagos",
    code: "LA",
    capital: "Ikeja",
    zone: "South West",
    lgas: 20,
    is_active: true,
  },
  {
    name: "Ogun",
    code: "OG",
    capital: "Abeokuta",
    zone: "South West",
    lgas: 20,
    is_active: true,
  },
  {
    name: "Ondo",
    code: "ON",
    capital: "Akure",
    zone: "South West",
    lgas: 18,
    is_active: true,
  },
  {
    name: "Osun",
    code: "OS",
    capital: "Osogbo",
    zone: "South West",
    lgas: 30,
    is_active: true,
  },
  {
    name: "Oyo",
    code: "OY",
    capital: "Ibadan",
    zone: "South West",
    lgas: 33,
    is_active: true,
  },
];

// Summary Statistics
export const nigerianStatesStats = {
  totalStates: nigerianStatesData.length,
  totalLGAs: nigerianStatesData.reduce((sum, state) => sum + state.lgas, 0),
  zoneDistribution: {
    "North Central": nigerianStatesData.filter(s => s.zone === "North Central").length,
    "North East": nigerianStatesData.filter(s => s.zone === "North East").length,
    "North West": nigerianStatesData.filter(s => s.zone === "North West").length,
    "South East": nigerianStatesData.filter(s => s.zone === "South East").length,
    "South South": nigerianStatesData.filter(s => s.zone === "South South").length,
    "South West": nigerianStatesData.filter(s => s.zone === "South West").length,
  }
};

// Helper function to get states by zone
export const getStatesByZone = (zone: string) => {
  return nigerianStatesData.filter(state => state.zone === zone);
};

// Helper function to get total LGAs by zone
export const getLGACountByZone = (zone: string) => {
  return nigerianStatesData
    .filter(state => state.zone === zone)
    .reduce((sum, state) => sum + state.lgas, 0);
};