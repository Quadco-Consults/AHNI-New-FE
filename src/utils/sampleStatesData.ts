import { NigerianStateData } from "@/data/nigerianStatesData";

/**
 * Sample states for quick testing - one from each geopolitical zone
 */
export const sampleStatesData: NigerianStateData[] = [
  // Federal Capital Territory
  {
    name: "Federal Capital Territory",
    code: "FCT",
    capital: "Abuja",
    zone: "North Central",
    lgas: 6,
    is_active: true,
  },
  // Major states - one from each zone
  {
    name: "Lagos",
    code: "LA",
    capital: "Ikeja",
    zone: "South West",
    lgas: 20,
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
    name: "Rivers",
    code: "RI",
    capital: "Port Harcourt",
    zone: "South South",
    lgas: 23,
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
    name: "Borno",
    code: "BO",
    capital: "Maiduguri",
    zone: "North East",
    lgas: 27,
    is_active: true,
  },
];

export const sampleStatesStats = {
  totalStates: sampleStatesData.length,
  totalLGAs: sampleStatesData.reduce((sum, state) => sum + state.lgas, 0),
  zones: Array.from(new Set(sampleStatesData.map(s => s.zone))).length,
};