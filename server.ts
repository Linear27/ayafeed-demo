
import express from "express";
import { createServer as createViteServer } from "vite";
import { EVENTS, LIVES, CIRCLES } from "./data";
import { 
  MarketRegion, 
  PublicEventListItem, 
  PublicLiveListItem, 
  PublicCircleListItem
} from "./types";

const DEFAULT_SOURCE_URL = "https://vanishinghermit.com/kkzsk/";

const toMarketRegion = (worldRegion?: string): MarketRegion => (
  worldRegion === "JP"
    ? "JAPAN"
    : worldRegion === "CN"
      ? "CN_MAINLAND"
      : "OVERSEAS"
);

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

type FlatEventDocument = {
  entityType: string;
  label: string;
  order: number;
  url: string;
  type: "PDF" | "Link";
  category: "Attendee" | "Circle";
};

type GeminiChatMessage = {
  role: "user" | "model";
  text: string;
};

const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_ERROR_MESSAGE = "🙇‍♀️ My long-range lens is foggy! (API Error)";
const GEMINI_MISSING_API_KEY_MESSAGE = "🙇‍♀️ 哎呀！我的远程镜头（API Key）还没准备好。请在环境变量中配置 GEMINI_API_KEY 后再试。";

const buildSystemInstruction = () => `
You are "Aya Shameimaru" (射命丸文), the crow tengu newspaper reporter.
"文文。快讯" (AyaFeed) is now expanding to support GLOBAL correspondents!

Regional Knowledge (Updated):
- JP (日本国内): Your core base. Most important coverage.
- CN (中国大陆): Independent channel focusing on Mainland events like CP30.
- OVERSEA (海外分社): Consolidates all other overseas regions (HK/TW/SEA/KR/NA/EU). Treat this as your "Overseas Dispatch" bureau.
- Handle multiple currencies (THB, TWD, CNY, JPY, USD) naturally.

Current Database:
- Events: ${JSON.stringify(EVENTS.map((event) => ({
  id: event.id,
  title: event.title,
  region: event.worldRegion,
  country: event.country,
  date: event.date,
})))}
- Lives: ${JSON.stringify(LIVES.map((live) => ({
  id: live.id,
  title: live.title,
  region: live.worldRegion,
  date: live.date,
})))}

Rules:
1. Persona: Energetic, journalistic, obsessed with speed. Refer to international news as "Overseas Dispatch" (海外分社速报).
2. Regional Accuracy: Group everything outside Japan and Mainland China as "Oversea Branch".
3. Logic: If a user asks about events in Taiwan or Thailand, refer to them as "Overseas Branch news" (海外分社消息).
4. Language: Match the user's language. If they ask in Chinese, answer in Chinese with your Tengu persona and refer to the app as "文文。快讯".
`;

const SYSTEM_INSTRUCTION = buildSystemInstruction();

const normalizeChatHistory = (value: unknown): GeminiChatMessage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is GeminiChatMessage => {
      return (
        typeof item === "object" &&
        item !== null &&
        ((item as GeminiChatMessage).role === "user" || (item as GeminiChatMessage).role === "model") &&
        typeof (item as GeminiChatMessage).text === "string"
      );
    })
    .slice(-30);
};

const flattenEventDocs = (event: any): FlatEventDocument[] => {
  const docs = event?.docs || {};
  const categories: Array<["attendee" | "circle", "Attendee" | "Circle"]> = [
    ["attendee", "Attendee"],
    ["circle", "Circle"],
  ];
  const output: FlatEventDocument[] = [];

  categories.forEach(([key, category]) => {
    const list = Array.isArray(docs?.[key]) ? docs[key] : [];
    list.forEach((raw: any, index: number) => {
      const label = safeString(raw?.title, `${category} Document ${index + 1}`);
      const url = raw?.url && raw.url !== "#" ? raw.url : (event?.website || DEFAULT_SOURCE_URL);
      output.push({
        entityType: "event",
        label,
        order: output.length + 1,
        url,
        type: raw?.type === "PDF" ? "PDF" : "Link",
        category,
      });
    });
  });

  if (output.length === 0) {
    output.push({
      entityType: "event",
      label: "活动信息索引",
      order: 1,
      url: event?.website || DEFAULT_SOURCE_URL,
      type: "Link",
      category: "Attendee",
    });
  }

  return output;
};

// Helper to map old Event to new PublicEventListItem
const mapEventToListItem = (e: any): PublicEventListItem => ({
  id: e.id,
  slug: e.id, // Using ID as slug for mock
  kind: "event",
  eventSeriesKey: e.id.split('_')[0],
  posterOrientation: e.posterOrientation || "portrait",
  startAt: `${e.date}T00:00:00Z`,
  endAt: `${e.date}T23:59:59Z`,
  title: e.title,
  summary: e.description.substring(0, 100),
  location: {
    name: e.location,
    address: e.location,
    description: null,
    timeZone: "Asia/Tokyo",
    city: e.location.split(' ')[0],
    cityKey: null,
    countryCode: e.country || "JP",
    lat: e.venueCoordinates?.[1] != null ? String(e.venueCoordinates[1]) : null,
    lng: e.venueCoordinates?.[0] != null ? String(e.venueCoordinates[0]) : null
  },
  marketRegion: toMarketRegion(e.worldRegion),
  poster: {
    imageId: e.id,
    altText: e.title,
    variants: ["sm", "md", "lg"],
    urls: {
      original: e.image,
      sm: e.image,
      md: e.image,
      lg: e.image
    }
  },
  displayLocale: "zh",
  fallbackUsed: false,
  counts: { touhouEvents: e.boothCount || 0 },
  events: [{ id: e.id, slug: e.id, title: e.title }],
  genres: e.genre || [],
  boothCount: e.boothCount || 0,
  // Legacy compatibility
  image: e.image,
  date: e.date,
  organizer: e.organizer,
  description: e.description,
  worldRegion: e.worldRegion,
  docs: flattenEventDocs(e)
});

// Helper to map old Live to new PublicLiveListItem
const mapLiveToListItem = (l: any): PublicLiveListItem => ({
  id: l.id,
  slug: l.id,
  startAt: `${l.date}T${l.startTime || '18:00'}:00Z`,
  endAt: `${l.date}T${l.endTime || '21:00'}:00Z`,
  title: l.title,
  description: l.description,
  location: {
    name: l.venue,
    address: l.venue,
    description: null,
    timeZone: "Asia/Tokyo",
    city: l.venue.split(' ')[0],
    cityKey: null,
    countryCode: l.country || "JP",
    lat: l.venueCoordinates?.[1] != null ? String(l.venueCoordinates[1]) : null,
    lng: l.venueCoordinates?.[0] != null ? String(l.venueCoordinates[0]) : null
  },
  venue: l.venue, // Keep venue as string for legacy if needed, though PublicLiveListItem has it as string|null
  poster: {
    imageId: l.id,
    altText: l.title,
    variants: ["sm", "md", "lg"],
    urls: {
      original: l.image,
      sm: l.image,
      md: l.image,
      lg: l.image
    }
  },
  worldRegion: l.worldRegion,
  marketRegion: toMarketRegion(l.worldRegion),
});

// Helper to map old Circle to new PublicCircleListItem
const mapCircleToListItem = (c: any): PublicCircleListItem => {
  const avatar = {
    imageId: c.id,
    altText: c.name,
    variants: ["sm", "md", "lg"] as Array<"sm" | "md" | "lg">,
    urls: {
      original: c.image,
      sm: c.image,
      md: c.image,
      lg: c.image
    }
  };

  const base: PublicCircleListItem = {
    id: c.id,
    title: c.name,
    slug: c.id,
    publishedAt: new Date().toISOString(),
    isCertified: true,
    organizer: { name: c.penName, url: null },
    avatar,
    penName: c.penName,
    commissionStatus: "open",
    classification: {
      mainType: (c.classification?.mainType || c.genre?.[0] || "Other") as any,
      subType: c.classification?.subType || null,
      scale: (c.classification?.scale || "Individual") as any,
      focus: (c.classification?.focus || "Event") as any
    },
    tags: c.tags || c.genre || []
  };

  // Compatibility payload for existing event-detail cards and preview modal.
  return {
    ...(base as any),
    name: c.name,
    image: c.image,
    banner: c.banner || null,
    summary: c.description || null,
    poster: avatar,
    genres: c.genre || [],
    socials: c.socials || {},
    events: c.events || [],
    gallery: c.gallery || [],
    spaceCode: c.events?.[0]?.spaceCode || null,
  } as any;
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "1mb" }));

  const router = express.Router();

  // --- Events ---
  router.get("/events", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const marketRegion = req.query.marketRegion as string;
    
    let filtered = EVENTS;
    if (marketRegion) {
      const mappedRegion = marketRegion === 'JAPAN' ? 'JP' : marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA';
      filtered = filtered.filter(e => e.worldRegion === mappedRegion);
    }

    // Sort first to avoid "old first page" causing the UI to think there are no upcoming events.
    const sorted = [...filtered].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const items = sorted.slice((page - 1) * pageSize, page * pageSize).map(mapEventToListItem);
     
    res.json({
      items,
      pageInfo: {
        page,
        pageSize,
        total: filtered.length
      }
    });
  });

  router.get("/events/:slug", (req, res) => {
    const event = EVENTS.find(e => e.id === req.params.slug);
    if (!event) return res.status(404).json({ message: "Not found", code: "NOT_FOUND" });
    
    const listItem = mapEventToListItem(event);
    res.json({
      event: {
        id: listItem.id,
        slug: listItem.slug,
        kind: "event",
        eventSeriesKey: listItem.eventSeriesKey,
        posterOrientation: listItem.posterOrientation,
        startAt: listItem.startAt,
        endAt: listItem.endAt
      },
      displayLocale: "zh",
      fallbackUsed: false,
      location: listItem.location,
      marketRegion: listItem.marketRegion,
      translations: [{
        locale: "zh",
        title: event.title,
        summary: event.description.substring(0, 100),
        content: event.description,
        transportation: event.transportation || null
      }],
      meta: {
        organizer: event.organizer,
        illustrator: event.illustrator || null,
        boothCount: event.boothCount,
        entryFee: event.entryFee,
        website: event.website || null,
        genre: event.genre,
        schedule: event.schedule || [],
        news: event.news || [],
        notices: event.notices || [],
        venueMaps: event.venueMaps || [],
        features: event.features || []
      },
      poster: listItem.poster,
      subevents: [],
      floorMapImages: (event.floorMapImages || []).map((img: any) => ({
        imageId: img.name,
        altText: img.name,
        variants: ["lg"],
        urls: { original: img.url, lg: img.url }
      })),
      availableLocales: ["zh", "ja", "en"],
      availableDocuments: flattenEventDocs(event)
    });
  });

  // --- Lives ---
  router.get("/lives", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    const sorted = [...LIVES].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const items = sorted.slice((page - 1) * pageSize, page * pageSize).map(mapLiveToListItem);
     
    res.json({
      items,
      pageInfo: {
        page,
        pageSize,
        total: LIVES.length
      }
    });
  });

  router.get("/lives/:slug", (req, res) => {
    const live = LIVES.find(l => l.id === req.params.slug);
    if (!live) return res.status(404).json({ message: "Not found", code: "NOT_FOUND" });
    
    const listItem = mapLiveToListItem(live);
    res.json({
      live: {
        ...listItem,
        openTime: live.openTime || null,
        startTime: live.startTime || null,
        price: live.price || null,
        ticketAgencies: [],
        schedule: live.schedule || [],
        setlist: [],
        notes: live.notes || [],
        performers: [],
        ticketTiers: (live.ticketTiers || []).map((t: any) => ({
          id: t.name,
          name: t.name,
          price: t.price,
          status: t.status === 'Available' ? 'available' : 'sold_out',
          link: null,
          benefits: []
        })),
        goods: (live.goods || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          price: g.price,
          category: g.type || null,
          purchaseLimit: null,
          image: {
            imageId: g.id,
            altText: g.name,
            variants: ["md"],
            urls: { original: g.image, md: g.image }
          }
        })),
        logoImage: live.logo ? {
          imageId: "logo",
          altText: "logo",
          variants: ["sm"],
          urls: { original: live.logo, sm: live.logo }
        } : null,
        seatingChartImage: null
      }
    });
  });

  // --- Circles ---
  router.get("/circles", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const eventId = req.query.eventId as string;
    
    let filteredCircles = CIRCLES;
    if (eventId) {
      filteredCircles = CIRCLES.filter(c => c.events.some(e => e.eventId === eventId));
    }
    
    const items = filteredCircles.slice((page - 1) * pageSize, page * pageSize).map(mapCircleToListItem);
    
    res.json({
      items,
      pageInfo: {
        page,
        pageSize,
        total: filteredCircles.length
      }
    });
  });

  router.get("/circles/:slug", (req, res) => {
    const circle = CIRCLES.find(c => c.id === req.params.slug);
    if (!circle) return res.status(404).json({ message: "Not found", code: "NOT_FOUND" });
    
    const listItem = mapCircleToListItem(circle);
    res.json({
      circle: {
        ...listItem,
        description: circle.description,
        links: [],
        platformUrls: circle.socials || {},
        bannerImage: {
          imageId: "banner",
          altText: "banner",
          variants: ["lg"],
          urls: { original: circle.banner, lg: circle.banner }
        },
        gallery: (circle.gallery || []).map((url: string, idx: number) => ({
          id: `img-${idx}`,
          imageUrl: url,
          collectionId: null,
          orderIndex: idx
        })),
        collections: [],
        participationHistory: (circle.events || []).map((e: any) => ({
          id: e.eventId,
          event: {
            id: e.eventId,
            slug: e.eventId,
            title: e.eventName,
            startAt: e.date || "",
            endAt: e.date || ""
          },
          boothCode: e.spaceCode,
          hall: null,
          subeventId: null,
          products: []
        })),
        eventHistory: []
      }
    });
  });

  router.post("/chat", async (req, res) => {
    const rawMessage = req.body?.newMessage;
    const newMessage = typeof rawMessage === "string" ? rawMessage.trim() : "";
    if (!newMessage) {
      return res.status(400).json({ message: "消息不能为空。" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      return res.status(500).json({ message: GEMINI_MISSING_API_KEY_MESSAGE });
    }

    const history = normalizeChatHistory(req.body?.history);

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: GEMINI_MODEL,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
        history: history.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
      });

      const result = await chat.sendMessage({ message: newMessage });
      return res.json({ text: result.text || GEMINI_ERROR_MESSAGE });
    } catch (error) {
      console.error("Gemini API Error:", error);
      return res.status(502).json({ message: GEMINI_ERROR_MESSAGE });
    }
  });

  // Mount the router
  app.use("/v1/public", router);
  app.use("/api/public", router); // Compatibility

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
