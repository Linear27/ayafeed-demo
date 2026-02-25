
import express from "express";
import { createServer as createViteServer } from "vite";
import { EVENTS, LIVES, CIRCLES } from "./data";
import { 
  MarketRegion, 
  PublicEventListItem, 
  PublicLiveListItem, 
  PublicCircleListItem,
  PublicLocation,
  PublicPoster
} from "./types";

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
    lat: null,
    lng: null
  },
  marketRegion: (e.worldRegion === 'JP' ? 'JAPAN' : e.worldRegion === 'CN' ? 'CN_MAINLAND' : 'OVERSEAS') as MarketRegion,
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
  docs: e.docs || []
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
    lat: null,
    lng: null
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
  marketRegion: (l.worldRegion === 'JP' ? 'JAPAN' : l.worldRegion === 'CN' ? 'CN_MAINLAND' : 'OVERSEAS') as MarketRegion,
});

// Helper to map old Circle to new PublicCircleListItem
const mapCircleToListItem = (c: any): PublicCircleListItem => ({
  id: c.id,
  title: c.name,
  slug: c.id,
  publishedAt: new Date().toISOString(),
  isCertified: true,
  organizer: { name: c.penName, url: null },
  avatar: {
    imageId: c.id,
    altText: c.name,
    variants: ["sm", "md", "lg"],
    urls: {
      original: c.image,
      sm: c.image,
      md: c.image,
      lg: c.image
    }
  },
  penName: c.penName,
  commissionStatus: "open",
  classification: {
    mainType: (c.genre?.[0] || "Other") as any,
    scale: "Individual",
    focus: "Event"
  },
  tags: c.genre || []
});

async function startServer() {
  const app = express();
  const PORT = 3000;

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

    const items = filtered.slice((page - 1) * pageSize, page * pageSize).map(mapEventToListItem);
    
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
      availableDocuments: []
    });
  });

  // --- Lives ---
  router.get("/lives", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    const items = LIVES.slice((page - 1) * pageSize, page * pageSize).map(mapLiveToListItem);
    
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
