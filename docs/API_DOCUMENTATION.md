# API 接口文档 (Current Code Aligned)

本文档按你原型的格式整理，内容与当前代码实现一致（`apps/api/src/routes/public/*`）。

## 基础信息
- **推荐 Base URL**: `/v1/public`
- **兼容 Base URL**: `/api/public`、`/`（同一套 public 路由）
- **Content-Type**: `application/json`
- **可选请求头**: `Accept-Language`、`x-user-locale`

---

## 1. 展会 (Events)

### 获取展会列表
- **Endpoint**: `GET /events`
- **查询参数**:
- `page` (可选, 默认 1)
- `pageSize` (可选, 最大 50)
- `search` (可选)
- `cityKey` (可选)
- `countryCode` (可选, ISO 3166-1 alpha-2)
- `marketRegion` (可选: `JAPAN | CN_MAINLAND | OVERSEAS`)
- `genre` (可选, 前端二次过滤)
- `timeBucket` (可选: `upcoming | past`)
- `featured` (可选: `true | false | 1 | 0`)
- **注意**:
- 旧参数 `city`、`region` 已移除，传入会返回 `400 VALIDATION_FAILED`
- **预期响应**:
- `200 OK`: `PublicEventsListResponse`
- `400 Bad Request`: 参数非法

### 获取特定展会详情
- **Endpoint**: `GET /events/:slug`
- **参数**: `slug`（非 UUID 风格 slug）
- **预期响应**:
- `200 OK`: `PublicEventDetailResponse`
- `302 Found`: slug 重定向到 canonical slug
- `404 Not Found`: 资源不存在或不可见

### 获取展会参展社团列表
- **Endpoint**: `GET /events/:slug/circles`
- **参数**: `slug`
- **查询参数**:
- `page` (可选, 默认 1)
- `pageSize` (可选, 最大 200)
- `search` (可选, boothCode/circleName)
- `subeventId` (可选)
- **预期响应**:
- `200 OK`: `PublicEventCirclesResponse`
- `302 Found`: slug 重定向
- `404 Not Found`

### 获取展会文档（按 label）
- **Endpoint**: `GET /events/:slug/documents/:label`
- **参数**: `slug`, `label`
- **预期响应**:
- `200 OK`: `PublicDocumentResponse`
- `304 Not Modified`: 命中 `If-None-Match`
- `302 Found`: slug 重定向
- `404 Not Found`

### 获取系列活动列表
- **Endpoint**: `GET /events/:slug/series`
- **参数**: `slug`
- **预期响应**:
- `200 OK`: `PublicEventSeriesResponse`
- `404 Not Found`

### 获取子活动详情
- **Endpoint**: `GET /events/:slug/subevents/:subeventId`
- **参数**: `slug`, `subeventId`
- **预期响应**:
- `200 OK`: `PublicSubeventDetailResponse`
- `404 Not Found`

---

## 2. 演出 (Lives)

### 获取演出列表
- **Endpoint**: `GET /lives`
- **查询参数**:
- `page` (可选, 默认 1)
- `pageSize` (可选, 最大 50)
- `search` (可选)
- `from` (可选)
- `to` (可选)
- `order` (可选: `asc | desc`)
- `cityKey` (可选)
- `countryCode` (可选)
- `marketRegion` (可选: `JAPAN | CN_MAINLAND | OVERSEAS`)
- **注意**:
- 旧参数 `city`、`region` 已移除，传入会返回 `400 VALIDATION_FAILED`
- **预期响应**:
- `200 OK`: `PublicLivesListResponse`
- `400 Bad Request`

### 获取特定演出详情
- **Endpoint**: `GET /lives/:slug`
- **参数**: `slug`
- **预期响应**:
- `200 OK`: `PublicLiveDetailResponse`
- `302 Found`: slug 重定向
- `404 Not Found`

---

## 3. 社团 (Circles)

### 获取社团列表
- **Endpoint**: `GET /circles`
- **查询参数**:
- `page` (可选, 默认 1)
- `pageSize` (可选, 最大 200)
- `search` (可选)
- `countryCode` (可选)
- `marketRegion` (可选: `JAPAN | CN_MAINLAND | OVERSEAS`)
- **预期响应**:
- `200 OK`: `PublicCirclesListResponse`
- `400 Bad Request`

### 获取特定社团详情
- **Endpoint**: `GET /circles/:slug`
- **参数**: `slug`
- **预期响应**:
- `200 OK`: `PublicCircleDetailResponse`
- `302 Found`: slug 重定向
- `404 Not Found`

### 获取社团文档（按 label）
- **Endpoint**: `GET /circles/:slug/documents/:label`
- **参数**: `slug`, `label`
- **预期响应**:
- `200 OK`: `PublicDocumentResponse`
- `304 Not Modified`: 命中 `If-None-Match`
- `302 Found`: slug 重定向
- `404 Not Found`

### 获取社团商品列表
- **Endpoint**: `GET /circles/:slug/products`
- **参数**: `slug`
- **查询参数**:
- `page` (可选, 默认 1)
- `pageSize` (可选, 默认 20, 最大 200)
- `category` (可选)
- `seriesId` (可选)
- **预期响应**:
- `200 OK`: `PublicCircleProductsResponse`
- `302 Found`: slug 重定向
- `404 Not Found`

---

## 4. 数据模型 (Data Models)

```typescript
type MarketRegion = "JAPAN" | "CN_MAINLAND" | "OVERSEAS";

type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
};

type PublicImageUrls = {
  original: string;
  sm?: string;
  md?: string;
  lg?: string;
};

type PublicPoster = {
  imageId: string;
  altText: string | null;
  variants: Array<"sm" | "md" | "lg">;
  urls: PublicImageUrls;
};

type PublicLocation = {
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

// Events
type PublicEventListItem = {
  id: string;
  slug: string | null;
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
};

type PublicEventsListResponse = {
  items: PublicEventListItem[];
  pageInfo: PageInfo;
};

type PublicEventDetailResponse = {
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
    genre: string[];
    schedule: unknown[];
    news: unknown[];
    notices: string[];
    venueMaps: unknown[];
    features: unknown[];
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
  }>;
};

type PublicEventCirclesResponse = {
  items: Array<{
    id: string; // eventCircleId
    circleId: string;
    circleName: string;
    circleSlug: string | null;
    circleAvatarUrl: string | null;
    boothCode: string | null;
    hall: string | null;
    hallName: string | null;
    block: string | null;
    subeventId: string | null;
    isAdultContent: boolean | null;
    products: Array<{
      id: string;
      name: string;
      priceAmount: number | null;
      priceCurrency: string | null;
      productType: "new" | "existing" | "goods" | "set";
      description: string | null;
      imageUrl: string | null;
    }>;
    listings: Array<{
      id: string;
      productId: string;
      productKey: string;
      category: string;
      name: string;
      description: string | null;
      saleType: string;
      priceAmount: number | null;
      priceCurrency: string | null;
      imageUrl: string | null;
      isFeatured: boolean;
      isSoldOut: boolean;
      orderIndex: number;
      consignmentFrom: {
        circleId: string;
        circleName: string;
        circleSlug: string | null;
      } | null;
    }>;
  }>;
  pageInfo: PageInfo;
  // 兼容字段（当前实现仍返回）
  data: Array<{
    id: string;
    circleId: string;
    circleName: string;
    circleSlug: string | null;
    hallName: string | null;
    products: Array<{
      id: string;
      name: string;
      priceAmount: number | null;
      priceCurrency: string | null;
      productType: "new" | "existing" | "goods" | "set";
      description: string | null;
      imageUrl: string | null;
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

type PublicEventSeriesResponse = {
  seriesKey: string;
  items: Array<{
    id: string;
    kind: "event" | "subevent";
    eventSeriesKey: string;
    slug: string | null;
    title: string | null;
    startAt: string | null;
    endAt: string | null;
  }>;
};

type PublicSubeventDetailResponse = {
  subevent: {
    id: string;
    kind: "subevent";
    eventSeriesKey: string;
    slug: string | null;
    title: string | null;
    startAt: string | null;
    endAt: string | null;
  }>;
  translations: Array<{
    locale: string;
    title: string;
    summary: string | null;
    content: string;
  }>;
  meta: unknown;
  displayLocale: string | null;
  fallbackUsed: boolean;
};

// Documents (event/circle)
type PublicDocumentResponse = {
  document: {
    entityType: "event" | "circle";
    entityId: string;
    label: string;
    publishedAt: string;
  };
  translation: {
    locale: string;
    title: string;
    summary: string | null;
    content: string;
  };
  availableLocales: string[];
  displayLocale: string;
  fallbackUsed: boolean;
};

// Lives
type PublicLiveListItem = {
  id: string;
  slug: string;
  startAt: string;
  endAt: string;
  title: string;
  description: string | null;
  location: PublicLocation | null;
  venue: null; // 当前实现恒为 null
  poster: PublicPoster | null;
};

type PublicLivesListResponse = {
  items: PublicLiveListItem[];
  pageInfo: PageInfo;
};

type PublicLiveDetailResponse = {
  live: {
    id: string;
    slug: string;
    startAt: string;
    endAt: string;
    title: string;
    description: string | null;
    location: PublicLocation | null;
    venue: null; // 当前实现恒为 null
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
};

// Circles
type PublicCirclesListResponse = {
  items: Array<{
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
  }>;
  pageInfo: PageInfo;
};

type PublicCircleDetailResponse = {
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
      products: Array<{
        id: string;
        name: string;
        priceAmount: number | null;
        priceCurrency: string | null;
        productType: "new" | "existing" | "goods" | "set";
        description: string | null;
        imageUrl: string | null;
      }>;
    }>;
    // 兼容别名：与 participationHistory 内容相同
    eventHistory: unknown[];
  };
};

type PublicCircleProductsResponse = {
  items: Array<{
    id: string;
    productKey: string;
    category: string;
    name: string;
    description: string | null;
    defaultPriceAmount: number | null;
    defaultPriceCurrency: string | null;
    imageUrl: string | null;
    tags: string[] | null;
    seriesId: string | null;
    seriesOrder: number | null;
    displayOrder: number;
    bundleItems: Array<{
      itemProductId: string;
      itemProductName: string;
      quantity: number;
    }>;
  }>;
  series: Array<{
    id: string;
    seriesKey: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    displayOrder: number;
  }>;
  paging: {
    page: number;
    pageSize: number;
    total: number;
  };
  displayLocale: string;
  fallbackUsed: boolean;
  availableLocales: string[];
};
```

### NewsItem（若前端从 `event.meta.news` 读取）
```typescript
type NewsItem = {
  date: string;
  title: string;
  type?: string;
  content?: string;
  url?: string;
};
```

---

## 5. 错误模型 (Error Model)

统一错误体：

```json
{ "message": "Not found", "code": "NOT_FOUND" }
```

常见错误码：
- `NOT_FOUND`
- `VALIDATION_FAILED`
- `INTERNAL_ERROR`
