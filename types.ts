

export type MarketRegion = "JAPAN" | "CN_MAINLAND" | "OVERSEAS";

export type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
};

export type PublicImageUrls = {
  original: string;
  sm?: string;
  md?: string;
  lg?: string;
};

export type PublicPoster = {
  imageId: string;
  altText: string | null;
  variants: Array<"sm" | "md" | "lg">;
  urls: PublicImageUrls;
};

export type PublicLocation = {
  name: string | null;
  address: string | null;
  description: string | null;
  timeZone: string | null;
  city: string | null;
  cityKey: string | null;
  countryCode: string | null;
  lat: string | null;
  lng: string | null;
};

// --- Events ---

export interface PublicEventDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  posterOrientation: 'portrait' | 'landscape' | null;
  poster: PublicPoster | null;
  genres: string[];
  boothCount: number;
  organizer: string;
  website: string;
  news: any[];
  docs: any[];
  floorMapImages: any[];
}

export interface PublicEventListItem {
  id: string;
  slug: string;
  kind: "event";
  eventSeriesKey: string;
  posterOrientation: "portrait" | "landscape" | null;
  startAt: string;
  endAt: string;
  title: string;
  summary: string | null;
  location: PublicLocation | null;
  marketRegion: MarketRegion | null;
  poster: PublicPoster | null;
  displayLocale: string | null;
  fallbackUsed: boolean;
  counts: { touhouEvents: number };
  events: Array<{ id: string; slug: string; title: string }>;
  genres: string[];
  boothCount: number | null;
  organizer?: string | null;
  image?: string;
  date?: string;
  description?: string;
  worldRegion?: string;
  docs?: any[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  country?: string;
  worldRegion?: string;
  image: string;
  posterOrientation?: 'portrait' | 'landscape';
  description: string;
  genre?: string[];
  organizer?: string;
  boothCount?: number;
  entryFee?: string;
  website?: string;
  venueCoordinates?: [number, number];
  transportation?: string;
  illustrator?: string;
  schedule?: any[];
  news?: any[];
  notices?: string[];
  venueMaps?: any[];
  features?: any[];
  floorMapImages?: any[];
  relatedEvents?: any[];
  docs?: any;
}

export interface EventSlot {
  key: string;
  dateStr: string;
  locationStr: string;
  events: PublicEventListItem[];
}

export interface PublicEventsListResponse {
  items: PublicEventListItem[];
  pageInfo: PageInfo;
}

export interface PublicEventDetailResponse {
  event: {
    id: string;
    slug: string;
    kind: "event";
    eventSeriesKey: string;
    posterOrientation: "portrait" | "landscape" | null;
    startAt: string;
    endAt: string;
  };
  displayLocale: string | null;
  fallbackUsed: boolean;
  location: PublicLocation | null;
  marketRegion: MarketRegion | null;
  translations: Array<{
    locale: string;
    title: string;
    summary: string | null;
    content: string;
    transportation: string | null;
  }>;
  meta: {
    organizer: string | null;
    illustrator: string | null;
    boothCount: number | null;
    entryFee: string | null;
    website?: string | null;
    genre: string[];
    schedule: any[];
    news: any[];
    notices: string[];
    venueMaps: any[];
    features: any[];
  } | null;
  poster: PublicPoster | null;
  subevents: Array<{
    id: string;
    eventSeriesKey: string;
    title: string | null;
    orderIndex: number;
  }>;
  floorMapImages: PublicPoster[];
  availableLocales: string[];
  availableDocuments: Array<{
    entityType: string;
    label: string;
    order: number;
    url?: string | null;
    type?: 'PDF' | 'Link' | null;
    category?: 'Attendee' | 'Circle' | string | null;
  }>;
}

// --- Lives ---

export interface Live {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  country?: string;
  worldRegion?: string;
  image: string;
  price?: string;
  description: string;
  artists?: Array<{ name: string; role: string; image: string; type?: string; group?: string }>;
  openTime?: string;
  startTime?: string;
  endTime?: string;
  schedule?: any[];
  notes?: string[];
  ticketTiers?: any[];
  goods?: any[];
  logo?: string;
  venueCoordinates?: [number, number];
  website?: string;
  docs?: any;
}

export interface PublicLiveListItem {
  id: string;
  slug: string;
  startAt: string;
  endAt: string;
  title: string;
  description: string | null;
  location: PublicLocation | null;
  venue: string | null;
  poster: PublicPoster | null;
  worldRegion?: string;
  marketRegion: MarketRegion | null;
}

export interface PublicLivesListResponse {
  items: PublicLiveListItem[];
  pageInfo: PageInfo;
}

export interface PublicLiveDetailResponse {
  live: {
    id: string;
    slug: string;
    startAt: string;
    endAt: string;
    title: string;
    description: string | null;
    location: PublicLocation | null;
    venue: string | null;
    poster: PublicPoster | null;
    openTime: string | null;
    startTime: string | null;
    price: string | null;
    ticketAgencies: Array<{ name: string; url: string; icon?: string }>;
    schedule: Array<{ time: string; artist?: string; description: string }>;
    setlist: string[];
    notes: string[];
    performers: Array<{
      id: string;
      name: string;
      performerType: "circle" | "artist" | "character";
      role: string | null;
      group: string | null;
      url: string | null;
      circleSlug: string | null;
      avatarImage: PublicPoster | null;
    }>;
    ticketTiers: Array<{
      id: string;
      name: string;
      price: string;
      status: "available" | "sold_out" | "lottery" | "ended";
      link: string | null;
      benefits: string[];
    }>;
    goods: Array<{
      id: string;
      name: string;
      price: string;
      category: string | null;
      purchaseLimit: string | null;
      image: PublicPoster | null;
    }>;
    logoImage: PublicPoster | null;
    seatingChartImage: PublicPoster | null;
  };
}

// --- Circles ---

export interface Circle {
  id: string;
  name: string;
  penName: string | null;
  description: string | null;
  genre?: string[];
  image: string;
  banner?: string;
  socials: {
    twitter?: string;
    pixiv?: string;
    website?: string;
    youtube?: string;
  };
  classification?: {
    mainType: string;
    subType?: string;
    scale: string;
    focus: string;
  };
  tags?: string[];
  events: Array<{
    eventId: string;
    eventName: string;
    date: string;
    spaceCode: string;
    status: 'Upcoming' | 'Ended';
    products: Array<{
      id: string;
      title: string;
      price: string;
      type: string;
      description?: string;
      image: string;
    }>;
  }>;
  gallery?: string[];
}

export interface PublicCircleListItem {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  isCertified: boolean;
  organizer: { name: string; url: string | null };
  avatar: PublicPoster | null;
  penName: string | null;
  commissionStatus: "open" | "closed" | "waitlist" | null;
  classification: {
    mainType: "Music" | "Manga/Illust" | "Novel" | "Game" | "Goods" | "Other";
    subType?: string | null;
    scale: "Individual" | "Team" | "Corporate";
    focus: "Event" | "Online";
  } | null;
  tags: string[];
}

export interface PublicCirclesListResponse {
  items: PublicCircleListItem[];
  pageInfo: PageInfo;
}

export interface PublicCircleDetailResponse {
  circle: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
    isCertified: boolean;
    organizer: { name: string; url: string | null };
    avatar: PublicPoster | null;
    penName: string | null;
    commissionStatus: "open" | "closed" | "waitlist" | null;
    classification: {
      mainType: "Music" | "Manga/Illust" | "Novel" | "Game" | "Goods" | "Other";
      subType?: string | null;
      scale: "Individual" | "Team" | "Corporate";
      focus: "Event" | "Online";
    } | null;
    tags: string[];
    description: string | null;
    links: string[];
    platformUrls: Record<string, string>;
    bannerImage: PublicPoster | null;
    gallery: Array<{
      id: string;
      imageUrl: string;
      collectionId: string | null;
      orderIndex: number;
    }>;
    collections: Array<{
      id: string;
      title: string;
      itemCount: number;
      coverImageUrl: string | null;
    }>;
    participationHistory: Array<{
      id: string;
      event: {
        id: string;
        slug: string | null;
        title: string;
        startAt: string;
        endAt: string;
      };
      boothCode: string | null;
      hall: string | null;
      subeventId: string | null;
      products: any[];
    }>;
    eventHistory: any[];
  };
}

// --- UI Types ---

export interface NewsItem {
  id?: string;
  title: string;
  date: string;
  type?: string;
  content?: string;
  url?: string;
}

export type Theme = 'newspaper';
export type Language = 'en' | 'ja' | 'zh';

export type ViewState = 
  | 'LANDING' 
  | 'EVENT_LIST' 
  | 'EVENT_DETAIL' 
  | 'LIVE_LIST' 
  | 'LIVE_DETAIL' 
  | 'CIRCLE_LIST' 
  | 'CIRCLE_DETAIL'
  | 'COMPONENT_SHOWCASE'
  | 'EVENT_LIST_EXP';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
