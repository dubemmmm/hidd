import type { MapAreaRisk } from "@/lib/types";

export const mapAreas: MapAreaRisk[] = [
  {
    id: "vi",
    name: "Victoria Island",
    label: "V.I.",
    tier: "low",
    floodRisk: 25,
    infrastructure: 90,
    titleComplexity: 12,
    narrative:
      "Victoria Island benefits from mature infrastructure, strong institutional presence, and comparatively cleaner title histories. Pricing is premium, but underlying demand drivers are real.",
    lat: 6.4281,
    lng: 3.4219
  },
  {
    id: "ikoyi",
    name: "Ikoyi",
    label: "Ikoyi",
    tier: "low",
    floodRisk: 18,
    infrastructure: 88,
    titleComplexity: 10,
    narrative:
      "Ikoyi remains one of Lagos' most defensible premium neighbourhoods, with strong road access, lower flood exposure, and more reliable ownership documentation.",
    lat: 6.4549,
    lng: 3.4338
  },
  {
    id: "lekki1",
    name: "Lekki Phase 1",
    label: "Lekki Ph1",
    tier: "low",
    floodRisk: 30,
    infrastructure: 78,
    titleComplexity: 20,
    narrative:
      "Lekki Phase 1 offers strong residential demand and relatively mature infrastructure, though pockets still require careful flood and access review.",
    lat: 6.4477,
    lng: 3.4738
  },
  {
    id: "lekki2",
    name: "Lekki Phase 2",
    label: "Lekki Ph2",
    tier: "medium",
    floodRisk: 50,
    infrastructure: 55,
    titleComplexity: 40,
    narrative:
      "Lekki Phase 2 is still consolidating. Infrastructure is improving, but buyers need sharper diligence around drainage, access quality, and allocation-related title friction.",
    lat: 6.4663,
    lng: 3.5317
  },
  {
    id: "ajah",
    name: "Ajah",
    label: "Ajah",
    tier: "high",
    floodRisk: 78,
    infrastructure: 32,
    titleComplexity: 70,
    narrative:
      "Ajah combines recurring flood pressure, infrastructure inconsistency, and elevated land-title dispute risk. Price alone should not drive the decision here.",
    lat: 6.4656,
    lng: 3.5685
  },
  {
    id: "sangotedo",
    name: "Sangotedo",
    label: "Sangotedo",
    tier: "high",
    floodRisk: 65,
    infrastructure: 28,
    titleComplexity: 68,
    narrative:
      "Sangotedo sits on an emerging corridor with speculative pricing, uneven infrastructure delivery, and a higher diligence burden before capital is committed.",
    lat: 6.4691,
    lng: 3.6206
  },
  {
    id: "surulere",
    name: "Surulere",
    label: "Surulere",
    tier: "medium",
    floodRisk: 35,
    infrastructure: 60,
    titleComplexity: 45,
    narrative:
      "Surulere remains desirable but carries ageing-infrastructure considerations and more complex family-held title histories in certain pockets.",
    lat: 6.4968,
    lng: 3.3515
  },
  {
    id: "ikeja",
    name: "Ikeja GRA",
    label: "Ikeja GRA",
    tier: "low",
    floodRisk: 20,
    infrastructure: 75,
    titleComplexity: 18,
    narrative:
      "Ikeja GRA offers stable governance, strong infrastructure, and relatively clear title pathways, making it one of the more defensible mainland premium zones.",
    lat: 6.5937,
    lng: 3.3426
  },
  {
    id: "yaba",
    name: "Yaba",
    label: "Yaba",
    tier: "medium",
    floodRisk: 40,
    infrastructure: 58,
    titleComplexity: 50,
    narrative:
      "Yaba's demand profile is strong, but buyers need to watch for title complications tied to older ownership chains and fragmented documentation.",
    lat: 6.5155,
    lng: 3.3711
  },
  {
    id: "magodo",
    name: "Magodo",
    label: "Magodo",
    tier: "medium",
    floodRisk: 30,
    infrastructure: 62,
    titleComplexity: 38,
    narrative:
      "Magodo is attractive for suburban residential buyers, but diligence still matters around access, drainage, and local title history.",
    lat: 6.6173,
    lng: 3.3867
  },
  {
    id: "gbagada",
    name: "Gbagada",
    label: "Gbagada",
    tier: "medium",
    floodRisk: 42,
    infrastructure: 55,
    titleComplexity: 42,
    narrative:
      "Gbagada faces uneven infrastructure delivery and flood-sensitive pockets, especially where rapid development has outrun planning.",
    lat: 6.5554,
    lng: 3.3923
  },
  {
    id: "ojodu",
    name: "Ojodu Berger",
    label: "Ojodu Berger",
    tier: "high",
    floodRisk: 60,
    infrastructure: 35,
    titleComplexity: 65,
    narrative:
      "Ojodu Berger presents a higher-risk combination of planning strain, flood vulnerability, and common land or documentation disputes.",
    lat: 6.647,
    lng: 3.3706
  }
];
