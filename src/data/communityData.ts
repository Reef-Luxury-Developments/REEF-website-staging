import { landmarkItem } from "../components/MapSection/InlineMap";

/**
 * Community Feature Interface
 * Represents a unique feature or highlight of a community
 */
export interface CommunityFeature {
  title: string;
  description: string;
}

/**
 * Community Data Interface
 * Complete schema for community details data
 *
 * Note: All text fields (name, subtitle, description, etc.) are returned
 * in the current language based on the 'accept-language' header sent to the API.
 * The API handles language switching automatically via axios interceptors.
 */
export interface CommunityData {
  // Basic Information
  id: string;
  slug?: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  area: string; // e.g., "Dubailand", "Al Furjan", etc.

  // Media Assets
  coverImageUrl: string; // Desktop cover image

  // Location Information
  latitude: number; // GPS latitude coordinate
  longitude: number; // GPS longitude coordinate
  locationDescription: string; // Description of the location and connectivity
  locationSectionTitle?: string; // Optional custom title for location section

  // Destinations/Nearby Places
  landmarks: landmarkItem[]; // Array of nearby destinations with distances

  // Community Features
  features: CommunityFeature[]; // Array of unique community features
  uniquenessSectionTitle?: string; // Optional custom title for uniqueness section

  // Call-to-Action Section
  ctaTitle?: string; // CTA headline (e.g., "Find Your Dream Home in DLRC")
  ctaDescription?: string; // CTA description text

  // Projects
  projectIds?: string[]; // Array of project IDs to display for this community

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Static Community Data for Development
 *
 * To add more communities for testing:
 * 1. Copy an existing community object
 * 2. Change the id and other fields
 * 3. Add it to the COMMUNITIES_MAP below
 *
 * In production, this data comes from the API endpoint:
 * GET /Website/GetCommunityDetails?CommunityId={id}
 */

// Community 1: DLRC
export const dlrcCommunityData: CommunityData = {
  id: "1",
  name: "Dubailand Residence Complex (DLRC)",
  shortName: "DLRC",
  subtitle: "Central Living with Exceptional Connectivity and Value",
  description:
    "Dubai Land Residence Complex (DLRC) is a vibrant, mixed-use community in Dubailand, spanning nearly 14 million square feet and offering a balanced lifestyle of modern living, strong connectivity, and exceptional long-term value. Strategically located near Sheikh Mohammed Bin Zayed Road (E311) and Al Ain Road (E66). DLRC provides excellent connectivity to major destinations, making it a highly attractive choice for families and investors in Dubai real estate.\n\nDLRC features residential and commercial developments complemented by generous open spaces and an extensive range of amenities. It includes parks, mosques, schools, medical centres, daycare facilities, and local shopping hubs. Residents also enjoy proximity to restaurants, hotels, and green spaces, creating a comfortable, convenient, and fully serviced environment. As one of Dubai's fastest-growing residential districts, DLRC continues to appeal to those seeking accessibility, value, and a well-connected lifestyle.",
  area: "Dubailand",
  coverImageUrl: "/assets/dubai-land.jpg",
  latitude: 25.093088900369573,
  longitude: 55.38140829039917,
  locationDescription:
    "Positioned near major highways such as Sheikh Mohammed Bin Zayed Road and Al Ain Road, DLRC delivers seamless connectivity to Dubai's most important destinations, from Business Bay and Downtown Dubai to Dubai International Airport, making it one of Dubai's most promising residential areas.",
  locationSectionTitle: "Prime Location & Connectivity",
  uniquenessSectionTitle: "What Makes DLRC Unique?",
  ctaTitle: "Find Your \n Dream Home in \n DLRC",
  ctaDescription:
    "A community defined by convenience, value, and long-term growth.",
  projectIds: [
    "9eeb19b4-c088-4e9a-64e2-08dde584ef9b",
    "a2e82a8a-ccef-44e0-21a0-08dde572e487",
  ], // Add your project IDs here, e.g., ["project-id-1", "project-id-2"]
  features: [
    {
      title: "Extensive Amenities & Connectivity",
      description:
        "Residents enjoy easy access to top leisure destinations like IMG Worlds of Adventure, Global Village, and key educational institutions, GEMS FirstPoint School, and healthcare facilities.",
    },
    {
      title: "Lively Community Spaces",
      description:
        "DLRC features community centers, playgrounds, landscaped parks, and sports facilities. These shared spaces encourage a vibrant, active lifestyle and support social interaction for families.",
    },
    {
      title: "Investment Potential & Enhanced Living",
      description:
        "The district's ongoing development, including retail hubs, residential expansions, and community upgrades, continues to strengthen its investment appeal and quality of life.",
    },
  ],
  landmarks: [
    {
      id: "1",
      name: "IMG Worlds of Adventure",
      iconType: "entertainment",
      time: "6 mins",
      lat: 25.08256354386867,
      lng: 55.319803749740636,
    },
    {
      id: "2",
      name: "Global Village",
      iconType: "culture",
      time: "15 mins",
      lat: 25.071873179627005,
      lng: 55.30849908053321,
    },
    {
      id: "3",
      name: "Academic City",
      iconType: "education",
      time: "8 mins",
      lat: 25.112100315819866,
      lng: 55.40763066861956,
    },
    {
      id: "4",
      name: "Dubai Silicon Oasis",
      iconType: "community",
      time: "9 mins",
      lat: 25.123915671692732,
      lng: 55.382256310955874,
    },
    {
      id: "5",
      name: "Dubai Outlet Mall",
      iconType: "shopping",
      time: "10 mins",
      lat: 25.073238354754366,
      lng: 55.399902161975575,
    },
    {
      id: "6",
      name: "Dubai Safari Park",
      iconType: "nature",
      time: "20 mins",
      lat: 25.172082601689805,
      lng: 55.44625465393038,
    },
    {
      id: "7",
      name: "Butterfly Garden",
      iconType: "garden",
      time: "18 mins",
      lat: 25.06,
      lng: 55.24,
    },
    {
      id: "8",
      name: "Dubai Aquarium",
      iconType: "aquarium",
      time: "25 mins",
      lat: 25.061891891462547,
      lng: 55.247107978463,
    },
  ],
};

// Community 2: Al Furjan (Sample Data)
export const alFurjanCommunityData: CommunityData = {
  id: "2",
  name: "Al Furjan",
  shortName: "Al Furjan",
  subtitle: "A Premier Lifestyle Destination in Jebel Ali",
  description:
    "Al Furjan is one of Dubai’s most vibrant and well-connected residential communities, offering modern living, family-friendly amenities, and exceptional access to the city’s top destinations. Strategically located near the Expo 2020 site, Dubai Marina, and the Al Furjan Metro Station, the area has become a leading hotspot for homeowners and investors seeking strong connectivity and high-return opportunities in Dubai’s real estate market.\n \n With continuous new developments and rising demand, Al Furjan delivers impressive ROI potential and long-term value. The community is fully serviced with Al Furjan Pavilion Mall, a wide selection of restaurants and cafés, reputable schools, healthcare options, and extensive sports and leisure facilities, making it one of Dubai’s most desirable neighborhoods for families and investors alike.",
  area: "Al Furjan",
  coverImageUrl: "/assets/al-furjan.jpg",
  latitude: 25.029356,
  longitude: 55.144622,
  locationSectionTitle: "Prime Location & Connectivity",
  locationDescription:
    "Al Furjan is positioned between Sheikh Zayed Road and Mohammed Bin Rashid Road. Its strategic location ensures effortless commutes and direct connectivity across Dubai.",
  uniquenessSectionTitle: "What Makes Al Furjan Unique?",
  ctaTitle: "Discover Your \n Dream Home in \n Al Furjan",
  ctaDescription:
    "A perfect blend of convenience, community, and modern living.",
  projectIds: ["b4f47dbe-4752-453d-64e0-08dde584ef9b"],
  features: [
    {
      title: "Comprehensive Accessibility",
      description:
        "Easy access to Dubai Marina, Expo City, Ibn Battuta, schools such as The Arbor School and Arcadia Global School, clinics, and the Al Furjan Metro Station, making everyday life effortless.",
    },
    {
      title: "Vibrant Community Facilities",
      description:
        "Home to Al Furjan Pavilion & Al Furjan Club, offering retail, dining, fitness, pools, sports courts, and community parks.",
    },
    {
      title: "Strong Investment Potential",
      description:
        "Competitive pricing, ongoing new developments, and rising rental demand make Al Furjan one of Dubai’s most attractive investment hubs.",
    },
  ],
  landmarks: [
    {
      id: "1",
      name: "Jebel Ali Village",
      iconType: "community",
      time: "5 mins",
      lat: 25.044,
      lng: 55.118,
    },
    {
      id: "2",
      name: "Dubai Marina",
      iconType: "landmark",
      time: "10 mins",
      lat: 25.08,
      lng: 55.139,
    },
    {
      id: "3",
      name: "Dubai Outlet Village",
      iconType: "shopping",
      time: "7 mins",
      lat: 25.045,
      lng: 55.155,
    },
    {
      id: "4",
      name: "Expo City",
      iconType: "entertainment",
      time: "10 mins",
      lat: 25.08,
      lng: 55.139,
    },
    {
      id: "5",
      name: "Al Furjan Metro Station",
      iconType: "transport",
      time: "10 mins",
      lat: 25.08,
      lng: 55.139,
    },
  ],
};

// Community 3: Dubai Sports City (Sample Data)
export const dubaiIslandsCommunityData: CommunityData = {
  id: "dubai-islands",
  name: "Dubai Islands",
  shortName: "Dubai Islands",
  subtitle: "The Ultimate Destination for Luxury Living",
  description:
    "Dubai Islands is set to emerge as a dynamic destination for both residents and visitors, offering a harmonious blend of luxury, convenience, and sustainability. With its strategic location, diverse lifestyle offerings, and forward-looking vision.\nDubai Islands is a landmark waterfront development by Nakheel, designed to redefine luxury coastal living in Dubai. Spanning five interconnected man-made islands across 17 square kilometers, the destination features premium residences, world-class resorts, pristine beaches, and vibrant cultural hubs, a future-ready community that embodies Dubai’s goal of becoming the best city for living in the world.\n Located just off the Deira shoreline and connected via the iconic Infinity Bridge, Dubai Islands offers exceptional access to Dubai Maritime City, Port Rashid, and Dubai International Airport. With more than 20 kilometers of beachfront and strong alignment with the Dubai 2040 Urban Master Plan, it stands out as one of the city’s most promising areas for beachfront properties and high-value real estate investment.",
  area: "Dubai Islands",
  coverImageUrl: "/assets/dubai-islands.webp",
  latitude: 25.039906,
  longitude: 55.221363,
  locationSectionTitle: "Prime Location & Connectivity",
  locationDescription:
    "Located in northeastern Dubai along the Deira coastline, just moments from Port Rashid and Dubai Maritime City. Seamlessly blends luxury residences, world-class hotels, marinas, and lifestyle districts into one unified shoreline experience.",

  uniquenessSectionTitle: "What Makes Dubai Islands Unique?",
  ctaTitle: "Find Your \n Dream Home in \n Dubai Islands",
  ctaDescription:
    "A lifestyle defined by exclusivity, luxury, and connectivity. ",
  projectIds: ["a94dd781-e493-4bbd-b9bf-08ddfa70e510"],
  features: [
    {
      title: "Integrated Living",
      description:
        "A new standard of coastal living where each island offers its own blend of innovative residential concepts, cultural destinations, recreational beaches, and vibrant beach clubs, all within minutes of Dubai’s city center and airport.",
    },
    {
      title: "Sustainable by Design",
      description:
        "Built with the future in mind, Dubai Islands emphasizes eco-friendly development, featuring sustainable hotels, energy-efficient infrastructure, and initiatives focused on protecting the natural environment.",
    },
    {
      title: "Endless Amenities",
      description:
        "Dubai Islands will be home to a surreal number of amenities and attractions that will attract both tourists and residents. It’s set to be home to over 80 hotels, 2sq km of parks and two premium Golf courses, and a huge range of other entertainment venues.",
    },
    {
      title: "Investment Potential",
      description:
        "Dubai Islands is an attractive option for substantial capital growth, especially with early investments. As the development matures and comes to life, prices are expected to follow.",
    },
  ],
  landmarks: [
    {
      id: "1",
      name: "Waterfront Market",
      iconType: "shopping",
      time: "5 mins",
      lat: 25.044,
      lng: 55.228,
    },
    {
      id: "2",
      name: "Dubai Outlet Mall",
      iconType: "shopping",
      time: "8 mins",
      lat: 25.073,
      lng: 55.4,
    },
    {
      id: "3",
      name: "Victory Heights",
      iconType: "community",
      time: "6 mins",
      lat: 25.065,
      lng: 55.236,
    },
  ],
};
export const DubaiProductionCityCommunityData: CommunityData = {
  id: "4",
  name: "Dubai Production City",
  shortName: "IMPZ",
  subtitle: "A Modern Community Built for Lifestyle and Connectivity",
  description:
    "Dubai Production City (IMPZ) redefines contemporary living in Dubai through its seamless blend of residential and commercial spaces. This modern, well-planned community offers curated amenities, a peaceful residential atmosphere, and exceptional connectivity — making it one of Dubai’s most sought-after areas for professionals, families, and investors. Designed with lifestyle and convenience in mind, Dubai Production City features an organized layout, excellent infrastructure, and a wide range of everyday facilities.\n With direct access to major highways and proximity to key Dubai destinations, Dubai Production City provides a refined living experience. Its strategic location and strong demand for modern, well-connected homes make it a popular choice for residents seeking comfort, convenience, and long-term value in Dubai’s growing real estate market",
  area: "Dubai Production City",
  coverImageUrl: "/assets/impz-dubai.jpg",
  latitude: 25.039906,
  longitude: 55.221363,
  locationSectionTitle: "Prime Location & Connectivity",
  locationDescription:
    "Strategically located near Sheikh Mohammed Bin Zayed Road (E311) and Al Khail Road (E44), the community offers easy access to key business districts such as Dubai Media City, Dubai Internet City, and Downtown Dubai, allowing residents to stay connected to vibrant hubs without the congestion of the city’s busiest areas.",

  uniquenessSectionTitle: "What Makes Dubai Production City Unique?",
  ctaTitle: "Find Your \n Dream Home in \n Dubai Production City ",
  ctaDescription:
    "A Dynamic Residential Community with Strong Investment Appeal",
  projectIds: ["78d4687c-637f-4960-e678-08de186ad260"],
  features: [
    {
      title: "Exceptional Accessibility",
      description:
        "Dubai Production City offers exceptional connectivity with its central location, major road access, and multiple public bus routes. With direct links to Sheikh Mohammed Bin Zayed Road (E311), DPC is minutes from Dubai Marina and Downtown Dubai, making it one of the city’s most conveniently connected communities.",
    },
    {
      title: "A Refined Work–Life Balance",
      description:
        "Designed for modern living, Dubai Production City blends work, leisure, and comfort seamlessly. Residents enjoy retail outlets, gyms, landscaped walkways, and community parks. With reputable schools, hospitals, and clinics close by, families have everything they need for a convenient and connected lifestyle.",
    },
    {
      title: "Promising Investment Value",
      description:
        "With its rising popularity, central location, and continuous development, Dubai Production City offers strong investment potential. The community’s residential and commercial properties are highly sought after by tenants and investors seeking modern living spaces with reliable rental returns.",
    },
  ],
  landmarks: [
    {
      id: "1",
      name: "Waterfront Market",
      iconType: "shopping",
      time: "5 mins",
      lat: 25.044,
      lng: 55.228,
    },
    {
      id: "2",
      name: "Dubai Outlet Mall",
      iconType: "shopping",
      time: "8 mins",
      lat: 25.073,
      lng: 55.4,
    },
    {
      id: "3",
      name: "Victory Heights",
      iconType: "community",
      time: "6 mins",
      lat: 25.065,
      lng: 55.236,
    },
  ],
};

/**
 * Map of community IDs to community data
 * Add new communities here to make them accessible by ID
 */
export const COMMUNITIES_MAP: Record<string, CommunityData> = {
  "1": dlrcCommunityData,
  "2": alFurjanCommunityData,
  "dubai-islands": dubaiIslandsCommunityData,
  "4": DubaiProductionCityCommunityData,
};

/**
 * Get community data by ID
 * Returns null if community doesn't exist
 */
export const getCommunityById = (id: string): CommunityData | null => {
  return COMMUNITIES_MAP[id] || null;
};

/**
 * Get all available community IDs
 */
export const getAvailableCommunityIds = (): string[] => {
  return Object.keys(COMMUNITIES_MAP);
};

// Export the first community as default for backward compatibility
export const exampleCommunityData = dlrcCommunityData;

export const getCommunityById5 = {
  id: "1",
  slug: "dubailand-residence-complex-dlrc",
  name: "Dubailand Residence Complex (DLRC)",
  shortName: "DLRC",
  subtitle: "Central Living with Exceptional Connectivity and Value",
  description: "",
  area: "Dubailand",
  coverImageUrl: "/assets/dubai-land.jpg",
  latitude: 25.093088900369573,
  longitude: 55.38140829039917,
  locationSectionTitle: "Prime Location & Connectivity",
  locationDescription: "",
  landmarks: [
    {
      id: "1",
      name: "IMG Worlds of Adventure",
      iconType: "entertainment",
      time: "6 mins",
      lat: 25.08256354386867,
      lng: 55.319803749740636,
    },
  ],
  uniquenessSectionTitle: "What Makes DLRC Unique?",
  features: [
    {
      title: "",
      description: "",
    },
  ],
  ctaTitle: "Find Your \n Dream Home in \n DLRC",
  ctaDescription:
    "A community defined by convenience, value, and long-term growth.",
  projectIds: [
    "9eeb19b4-c088-4e9a-64e2-08dde584ef9b",
    "a2e82a8a-ccef-44e0-21a0-08dde572e487",
  ], // Add your project IDs here, e.g., ["project-id-1", "project-id-2"]
};

export const getAllCommunities = [
  {
    id: "1",
    slug: "dubailand-residence-complex-dlrc",
    shortName: "DLRC",
    subtitle: "Central Living with Exceptional Connectivity and Value",
    coverImageUrl: "/assets/dubai-land.jpg",
    noOfProjects: 2,
  },
  {
    id: "2",
    slug: "al-furjan",
    shortName: "Al Furjan",
    subtitle: "A Premier Lifestyle Destination in Jebel Ali",
    coverImageUrl: "/assets/al-furjan.jpg",
    noOfProjects: 1,
  },
];
