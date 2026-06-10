import { VendorData } from "./types";

export const sampleVendorData: VendorData[] = [
  {
    id: "vendor-1",
    name: "SOUTHGATE TECHNOLOGIES LIMITED",
    items: [
      {
        id: "item-1",
        description: "Laptop Computer",
        specification: '15" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)',
        qty: 6,
        brand: "Dell",
        unitPrice: 3725192.50,
        total: 22351155.00,
        selected: false
      },
      {
        id: "item-2",
        description: "USB Headset",
        specification: "Noise-Cancelling USB Headset (H540)",
        qty: 6,
        brand: "Logitech",
        unitPrice: 69161.00,
        total: 414966.00
      },
      {
        id: "item-3",
        description: "Wireless Mouse",
        specification: "Wireless Mouse with USB Receiver",
        qty: 6,
        brand: "Logitech",
        unitPrice: 71392.00,
        total: 428352.00
      }
    ],
    grandTotal: 25954340.00,
    deliveryTime: "2-3 Weeks",
    paymentTerms: "100% Payment After Delivery",
    tin: "0336185-0001",
    validityPeriod: "1 Week",
    bankAccount: "YES",
    cacRegistration: "YES",
    workExperience: "YES",
    currency: "Naira",
    warranty: "OEM Warranty applicable",
    technicalEvaluations: [
      { criteria: "Technical Capability", response: "5 years experience in laptop supply and configuration" },
      { criteria: "Delivery Capacity", response: "Can deliver within 2-3 weeks with full setup" }
    ]
  },
  {
    id: "vendor-2",
    name: "SUNOK GLOBAL SYSTEMS LIMITED",
    items: [
      {
        id: "item-1-vendor2",
        description: "Laptop Computer",
        specification: '15" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)',
        qty: 6,
        brand: "HP",
        unitPrice: 3150000.00,
        total: 18900000.00
      },
      {
        id: "item-2-vendor2",
        description: "USB Headset",
        specification: "Noise-Cancelling USB Headset (H540)",
        qty: 6,
        brand: "Generic",
        unitPrice: 48000.00,
        total: 288000.00
      },
      {
        id: "item-3-vendor2",
        description: "Wireless Mouse",
        specification: "Wireless Mouse with USB Receiver",
        qty: 6,
        brand: "Generic",
        unitPrice: 48000.00,
        total: 288000.00
      }
    ],
    grandTotal: 21186000.00,
    deliveryTime: "2-3 Weeks",
    paymentTerms: "100% Payment After Delivery",
    tin: "0336185-0001",
    validityPeriod: "1 Week",
    bankAccount: "YES",
    cacRegistration: "YES",
    workExperience: "YES",
    currency: "Naira",
    warranty: "OEM Warranty applicable"
  },
  {
    id: "vendor-3",
    name: "VIABLE TRUST INVESTMENTS LTD",
    items: [
      {
        id: "item-1-vendor3",
        description: "Laptop Computer",
        specification: '15" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)',
        qty: 6,
        brand: "Lenovo",
        unitPrice: 5503680.00,
        total: 33022080.00
      },
      {
        id: "item-2-vendor3",
        description: "USB Headset",
        specification: "Noise-Cancelling USB Headset (H540)",
        qty: 6,
        brand: "Jabra",
        unitPrice: 41350.00,
        total: 248100.00
      },
      {
        id: "item-3-vendor3",
        description: "Wireless Mouse",
        specification: "Wireless Mouse with USB Receiver",
        qty: 6,
        brand: "Microsoft",
        unitPrice: 74500.00,
        total: 447000.00
      }
    ],
    grandTotal: 37065180.00,
    deliveryTime: "2-3 Weeks",
    paymentTerms: "100% Payment After Delivery",
    tin: "0336185-0001",
    validityPeriod: "1 Week",
    bankAccount: "YES",
    cacRegistration: "YES",
    workExperience: "YES",
    currency: "Naira",
    warranty: "OEM Warranty applicable"
  }
];
