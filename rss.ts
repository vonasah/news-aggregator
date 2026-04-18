// rss.ts - Professional RSS Aggregator for Deno Deploy
// v2.1 — KV size fix (per-category storage, compact payload),
//         broken feeds removed/replaced.

import { parseFeed } from "https://deno.land/x/rss/mod.ts";

// ==================== CONFIGURATION ====================

const RSS_FEEDS: Record<string, string[]> = {
    "World": [
        "https://feeds.bbci.co.uk/news/world/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "https://www.theguardian.com/world/rss",
        "https://feeds.npr.org/1004/rss.xml"
    ],
    "Economy": [
        "https://feeds.bbci.co.uk/news/business/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
        "https://www.theguardian.com/business/rss",
        "https://feeds.marketwatch.com/marketwatch/topstories/",
        "https://www.ft.com/rss/home"
    ],
    "Science": [
        "https://www.sciencedaily.com/rss/all.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
        "https://www.theguardian.com/science/rss",
        "https://www.nature.com/nature.rss",
        "https://www.newscientist.com/feed/home/"
    ],
    "Space": [
        "https://www.space.com/feeds/all",
        "https://www.nasa.gov/feed/",
        "https://phys.org/rss-feed/space-news/",
        "https://www.universetoday.com/feed/",
        "https://www.sciencedaily.com/rss/space_time.xml"
    ],
    "Technology": [
        "https://techcrunch.com/feed/",
        "https://www.theverge.com/rss/index.xml",
        "https://www.wired.com/feed/rss",
        "https://feeds.arstechnica.com/arstechnica/index",
        "https://www.engadget.com/rss.xml"
    ],
    "AI": [
        "https://techcrunch.com/category/artificial-intelligence/feed/",
        "https://www.technologyreview.com/topic/artificial-intelligence/feed",
        "https://venturebeat.com/category/ai/feed/",
        "https://openai.com/news/rss.xml",
        "https://www.wired.com/feed/tag/ai/latest/rss"
    ],
    "Gaming": [
        "https://www.polygon.com/rss/index.xml",
        "https://www.eurogamer.net/?format=rss",
        "https://kotaku.com/rss",
        "https://www.pcgamer.com/rss/",
        "https://feeds.ign.com/ign/games-all"
    ],
    "Cryptocurrency": [
        "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "https://cointelegraph.com/rss",
        "https://decrypt.co/feed",
        "https://bitcoinmagazine.com/.rss/full/"
    ],
    "Health": [
        "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
        "https://feeds.bbci.co.uk/news/health/rss.xml",
        "https://www.theguardian.com/society/health/rss",
        "https://www.statnews.com/feed/"
    ],
    "Sports": [
        "https://www.espn.com/espn/rss/news",
        "https://feeds.bbci.co.uk/sport/rss.xml",
        "https://www.theguardian.com/sport/rss",
        "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml"
    ],
    "Entertainment": [
        "https://variety.com/feed/",
        "https://www.hollywoodreporter.com/feed/",
        "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml",
        "https://deadline.com/feed/",
        "https://www.rollingstone.com/feed/"
    ],
    "Fashion": [
        "https://www.vogue.com/feed/rss",
        "https://www.harpersbazaar.com/rss/all.xml/",
        "https://www.elle.com/rss/all.xml/",
        "https://www.gq.com/feed/rss",
        "https://wwd.com/feed/"
    ],
    "Social Media": [
        "https://www.socialmediatoday.com/feeds/news/",
        "https://www.socialmediaexaminer.com/feed/",
        "https://techcrunch.com/category/social/feed/",
        "https://www.theverge.com/rss/index.xml"
    ],
    "Analytics": [
        "https://www.kdnuggets.com/feed",
        "https://towardsdatascience.com/feed",
        "https://flowingdata.com/feed/"
    ],
    "Trends": [
        "https://www.buzzfeed.com/index.xml",
        "https://mashable.com/feeds/rss/all",
        "https://www.theverge.com/rss/index.xml",
        "https://www.reddit.com/r/popular/.rss"
    ],
    "Fitness": [
        "https://www.menshealth.com/rss/all.xml/",
        "https://www.womenshealthmag.com/rss/all.xml/",
        "https://www.self.com/feed/rss",
        "https://www.nerdfitness.com/blog/feed/"
    ],
    "Travel": [
        "https://www.cntraveler.com/feed/rss",
        "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
        "https://www.travelandleisure.com/feeds/all.rss.xml"
    ],
    "Food": [
        "https://www.bonappetit.com/feed/rss",
        "https://www.eater.com/rss/index.xml",
        "https://www.foodandwine.com/feeds/all.rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml"
    ],
    "Environment": [
        "https://www.theguardian.com/environment/rss",
        "https://insideclimatenews.org/feed/",
        "https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml"
    ],
    "Politics": [
        "https://feeds.npr.org/1014/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
        "https://www.theguardian.com/politics/rss"
    ],
    "Startups": [
        "https://techcrunch.com/category/startups/feed/",
        "https://news.crunchbase.com/feed/",
        "https://www.eu-startups.com/feed/",
        "https://sifted.eu/feed",
        "https://venturebeat.com/category/entrepreneur/feed/"
    ],
    "Education": [
        "https://www.edsurge.com/articles_rss",
        "https://www.insidehighered.com/rss.xml",
        "https://hechingerreport.org/feed/",
        "https://www.theguardian.com/education/rss"
    ],
    "Art": [
        "https://news.artnet.com/feed",
        "https://hyperallergic.com/feed/",
        "https://www.theartnewspaper.com/rss",
        "https://www.theguardian.com/artanddesign/rss"
    ],
    "General": [
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        "https://feeds.npr.org/1001/rss.xml",
        "https://www.theguardian.com/international/rss"
    ]
};

const SOURCE_MAP: Record<string, string> = {
    "bbci.co.uk": "BBC", "bbc.com": "BBC", "bbc.co.uk": "BBC",
    "nytimes.com": "NYT",
    "theguardian.com": "The Guardian",
    "npr.org": "NPR",
    "apnews.com": "AP",
    "marketwatch.com": "MarketWatch",
    "ft.com": "Financial Times",
    "sciencedaily.com": "ScienceDaily",
    "nature.com": "Nature",
    "newscientist.com": "New Scientist",
    "space.com": "Space.com",
    "nasa.gov": "NASA",
    "phys.org": "Phys.org",
    "universetoday.com": "Universe Today",
    "techcrunch.com": "TechCrunch",
    "theverge.com": "The Verge",
    "wired.com": "Wired",
    "arstechnica.com": "Ars Technica",
    "engadget.com": "Engadget",
    "technologyreview.com": "MIT Tech Review",
    "venturebeat.com": "VentureBeat",
    "openai.com": "OpenAI",
    "polygon.com": "Polygon",
    "eurogamer.net": "Eurogamer",
    "kotaku.com": "Kotaku",
    "pcgamer.com": "PC Gamer",
    "ign.com": "IGN",
    "coindesk.com": "CoinDesk",
    "cointelegraph.com": "Cointelegraph",
    "decrypt.co": "Decrypt",
    "bitcoinmagazine.com": "Bitcoin Magazine",
    "statnews.com": "STAT",
    "espn.com": "ESPN", "espn.go.com": "ESPN",
    "variety.com": "Variety",
    "hollywoodreporter.com": "Hollywood Reporter",
    "deadline.com": "Deadline",
    "rollingstone.com": "Rolling Stone",
    "vogue.com": "Vogue",
    "harpersbazaar.com": "Harper's Bazaar",
    "elle.com": "Elle",
    "gq.com": "GQ",
    "wwd.com": "WWD",
    "mashable.com": "Mashable",
    "socialmediatoday.com": "Social Media Today",
    "socialmediaexaminer.com": "Social Media Examiner",
    "kdnuggets.com": "KDnuggets",
    "towardsdatascience.com": "Towards Data Science",
    "flowingdata.com": "FlowingData",
    "buzzfeed.com": "BuzzFeed",
    "reddit.com": "Reddit",
    "menshealth.com": "Men's Health",
    "womenshealthmag.com": "Women's Health",
    "self.com": "SELF",
    "nerdfitness.com": "Nerd Fitness",
    "cntraveler.com": "Condé Nast Traveler",
    "travelandleisure.com": "Travel + Leisure",
    "bonappetit.com": "Bon Appétit",
    "eater.com": "Eater",
    "foodandwine.com": "Food & Wine",
    "insideclimatenews.org": "Inside Climate News",
    "crunchbase.com": "Crunchbase",
    "eu-startups.com": "EU-Startups",
    "sifted.eu": "Sifted",
    "edsurge.com": "EdSurge",
    "insidehighered.com": "Inside Higher Ed",
    "hechingerreport.org": "Hechinger Report",
    "artnet.com": "Artnet",
    "hyperallergic.com": "Hyperallergic",
    "theartnewspaper.com": "The Art Newspaper"
};

const AD_PATTERNS = [
    /\bhome\s+equity\b/i,
    /\bcash\s+out\b/i,
    /\bheloc\b/i,
    /\breverse\s+mortgage\b/i,
    /\b(best|top)\s+(loan|loans|refinance|mortgage|credit\s+card)s?\b/i,
    /\brefinance\s+rates?\b/i,
    /\bdream\s+big\s+with\b/i,
    /\byou\s+won'?t\s+believe\b/i,
    /\bdoctors\s+hate\b/i,
    /\bone\s+weird\s+trick\b/i,
    /\b(casino|slots|online\s+gambling)\b/i,
    /\bbest\s+vpn\b/i,
    /\bvpn\s+deal(s)?\b/i,
    /\bsponsored\b/i,
    /\bpaid\s+partnership\b/i,
    /\badvertorial\b/i,
    /\bpress\s+release\b/i,
    /\bclick\s+here\b/i
];

function isAd(title: string, description: string): boolean {
    const combined = `${title} ${description}`.toLowerCase();
    return AD_PATTERNS.some(re => re.test(combined));
}

let kv: Deno.Kv | null = null;
try { kv = await Deno.openKv(); } catch (_e) { console.warn("KV unavailable"); }

const CACHE_TTL = 10 * 60 * 1000;
const STALE_TTL = 60 * 60 * 1000;
const MAX_CONCURRENT = 5;

class Semaphore {
    private permits: number;
    private queue: (() => void)[] = [];
    constructor(permits: number) { this.permits = permits; }
    async acquire(): Promise<void> {
        if (this.permits > 0) { this.permits--; return; }
        return new Promise(resolve => this.queue.push(resolve));
    }
    release(): void {
        if (this.queue.length > 0) { const r = this.queue.shift(); if (r) r(); }
        else this.permits++;
    }
}
const semaphore = new Semaphore(MAX_CONCURRENT);

// Decode HTML entities — handles numeric, hex, and named entities
function decodeEntities(text: string): string {
    if (!text) return "";
    return text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&#39;/gi, "'")
        .replace(/&#8217;/gi, "’")
        .replace(/&#8216;/gi, "‘")
        .replace(/&#8220;/gi, "“")
        .replace(/&#8221;/gi, "”")
        .replace(/&#8212;/gi, "—")
        .replace(/&#8211;/gi, "–")
        .replace(/&hellip;/gi, "…")
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
            const code = parseInt(h, 16);
            return isFinite(code) ? String.fromCharCode(code) : "";
        })
        .replace(/&#(\d+);/g, (_, n) => {
            const code = parseInt(n, 10);
            return isFinite(code) ? String.fromCharCode(code) : "";
        });
}

// Iteratively decode entities + strip tags until the result is stable.
// Handles double-escaped HTML (e.g. &lt;p&gt;... becomes <p>... becomes stripped)
// and RSS feeds that wrap content in CDATA with escape layers.
function stripHtml(input: string): string {
    if (!input) return "";
    let text = String(input);
    // Up to 3 iterations: decode entities, then strip tags. Stop when text stabilizes.
    for (let i = 0; i < 3; i++) {
        const before = text;
        // Remove script/style blocks with content
        text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
        // Decode entities FIRST — this may reveal more tags hidden as &lt;p&gt;
        text = decodeEntities(text);
        // Then strip any tags that are now visible
        text = text.replace(/<[^>]+>/g, " ");
        if (text === before) break;
    }
    return text.replace(/\s+/g, " ").trim();
}

function sanitizeHtml(input: string): string {
    if (!input) return "";
    let cleaned = String(input);
    // Decode double-escaped HTML first (so <p> etc. become real tags before sanitizing)
    for (let i = 0; i < 2; i++) {
        const before = cleaned;
        cleaned = decodeEntities(cleaned);
        // Only iterate further if we still see escaped tag patterns
        if (!/&lt;[a-z]/i.test(cleaned) && cleaned === before) break;
    }
    // Strip dangerous elements
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    cleaned = cleaned.replace(/\s+on\w+="[^"]*"/gi, "");
    cleaned = cleaned.replace(/\s+on\w+='[^']*'/gi, "");
    cleaned = cleaned.replace(/<img[^>]*width=["']?1["']?[^>]*>/gi, "");
    cleaned = cleaned.replace(/<img[^>]*height=["']?1["']?[^>]*>/gi, "");
    return cleaned.trim();
}

function removeRssTails(text: string): string {
    if (!text) return "";
    const patterns = [
        /The post .+? appeared first on .+?\.?$/i,
        /Continue reading.+$/i,
        /Read (the )?(full )?(story|article|more)( at| on)? [^.]+\.?$/i,
        /\[…\]$/,
        /\[\.\.\.\]$/,
        /\(more…\)$/,
        /\s*—\s*Read more.+$/i,
        /View entire post.+$/i,
        /Click here to read.+$/i,
        /See full story.+$/i,
    ];
    let out = text;
    for (const re of patterns) out = out.replace(re, "");
    return out.trim();
}

function smartTruncate(text: string, min = 100, max = 200): string {
    if (!text) return "";
    text = text.replace(/\s+/g, " ").trim();
    if (text.length <= max) return text;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    let built = "";
    for (const s of sentences) {
        const next = (built + s).trim();
        if (next.length > max) break;
        built = next;
        if (built.length >= min) return built;
    }
    if (built.length >= min) return built;
    const hardCut = text.substring(0, max);
    const lastSpace = hardCut.lastIndexOf(" ");
    if (lastSpace > min) return hardCut.substring(0, lastSpace).replace(/[,;:\s]+$/, "") + "…";
    return hardCut.replace(/[,;:\s]+$/, "") + "…";
}

function rawFieldToString(field: any): string {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field.value === "string") return field.value;
    return "";
}

function buildCleanDescription(entry: any): string {
    const raw = rawFieldToString(entry.description) || rawFieldToString(entry.summary) || rawFieldToString(entry.content);
    let text = stripHtml(raw);
    text = removeRssTails(text);
    return smartTruncate(text, 100, 200);
}

function buildFullContent(entry: any): string {
    const raw = rawFieldToString(entry.content) || rawFieldToString(entry.description) || rawFieldToString(entry.summary);
    return sanitizeHtml(raw);
}

function extractUrl(entry: any): string {
    if (typeof entry.link === "string" && entry.link.startsWith("http")) return entry.link;
    if (entry.link && typeof entry.link === "object") {
        if (typeof entry.link.href === "string" && entry.link.href.startsWith("http")) return entry.link.href;
        if (typeof (entry.link as any).value === "string" && (entry.link as any).value.startsWith("http")) return (entry.link as any).value;
    }
    if (Array.isArray(entry.links) && entry.links.length > 0) {
        const alt = entry.links.find((l: any) => l?.rel === "alternate" || !l?.rel);
        if (alt?.href) return alt.href;
        const firstWithHref = entry.links.find((l: any) => l?.href);
        if (firstWithHref?.href) return firstWithHref.href;
    }
    if (typeof (entry as any).href === "string" && (entry as any).href.startsWith("http")) return (entry as any).href;
    if (typeof entry.id === "string" && entry.id.startsWith("http")) return entry.id;
    if (typeof entry.guid === "string" && entry.guid.startsWith("http")) return entry.guid;
    if (entry.guid?.value && typeof entry.guid.value === "string" && entry.guid.value.startsWith("http")) return entry.guid.value;
    return "";
}

function extractImage(entry: any): string | null {
    if (entry.mediaContents && entry.mediaContents.length > 0) {
        for (const media of entry.mediaContents) {
            if (media.url && !media.url.includes("logo") && !media.url.includes("icon")) return media.url;
        }
    }
    if (entry.mediaThumbnails && entry.mediaThumbnails.length > 0 && entry.mediaThumbnails[0].url) {
        return entry.mediaThumbnails[0].url;
    }
    if (entry.enclosure && entry.enclosure.url && entry.enclosure.type?.startsWith("image/")) {
        return entry.enclosure.url;
    }
    const content = rawFieldToString(entry.content) || rawFieldToString(entry.description);
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1] && !imgMatch[1].includes("data:image")) return imgMatch[1];
    return null;
}

function parseDate(entry: any): Date {
    const raw = entry.published || entry.updated || entry.pubDate || entry.publishedRaw || new Date().toISOString();
    const date = new Date(raw);
    return isNaN(date.getTime()) ? new Date() : date;
}

function getSourceName(articleUrl: string, feedUrl: string): string {
    for (const u of [articleUrl, feedUrl].filter(Boolean)) {
        try {
            const hostname = new URL(u).hostname.toLowerCase().replace(/^www\./, "");
            if (SOURCE_MAP[hostname]) return SOURCE_MAP[hostname];
            const parts = hostname.split(".");
            for (let i = 1; i < parts.length; i++) {
                const parent = parts.slice(i).join(".");
                if (SOURCE_MAP[parent]) return SOURCE_MAP[parent];
            }
            let core = parts.length >= 3 ? parts[parts.length - 3] : parts[0];
            if (["feeds", "rss", "news", "api", "feed", "cdn", "www"].includes(core)) {
                core = parts.length >= 2 ? parts[parts.length - 2] : core;
            }
            if (core && !["feeds", "rss", "news"].includes(core)) {
                return core.charAt(0).toUpperCase() + core.slice(1);
            }
        } catch (_) { continue; }
    }
    return "News";
}

function computeImportance(title: string, url: string): number {
    const t = (title || "").toLowerCase();
    let bonus = 0;
    if (/\b(breaking|urgent|alert|just in|exclusive)\b/.test(t)) bonus = 3;
    else if (/\b(major|crisis|warning|dies|killed|attack|war|explosion|emergency)\b/.test(t)) bonus = 2;
    else if (/\b(announces|unveils|launches|reveals|report|study)\b/.test(t)) bonus = 1;
    let h = 0;
    const s = title || url || "x";
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    const base = 3 + (Math.abs(h) % 5);
    return Math.max(1, Math.min(10, base + bonus));
}

function isLowQuality(title: string, description: string, url: string): boolean {
    if (!title || title === "Untitled") return true;
    if (!url) return true;
    if (!description || description.length < 40) return true;
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normDesc = description.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normDesc.startsWith(normTitle) && normDesc.length - normTitle.length < 30) return true;
    return false;
}

// In-memory cache for individual feeds (not persisted to KV — too large)
const feedMemCache = new Map<string, { data: any[]; timestamp: number }>();

async function fetchFeed(url: string, category: string): Promise<any[]> {
    const cached = feedMemCache.get(url);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsAggregatorBot/1.0)" }
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            console.warn(`⚠️ HTTP ${response.status}: ${url}`);
            return [];
        }
        const xml = await response.text();
        const feed = await parseFeed(xml);

        const items = feed.entries.slice(0, 15).map((entry: any) => {
            const articleUrl = extractUrl(entry);
            const titleRaw = rawFieldToString(entry.title) || "Untitled";
            const title = stripHtml(titleRaw).trim() || "Untitled";
            const description = buildCleanDescription(entry);
            const fullContent = buildFullContent(entry);
            const image = extractImage(entry);
            const date = parseDate(entry);
            return {
                title,
                description,
                content: fullContent,
                category,
                importance: computeImportance(title, articleUrl),
                source: getSourceName(articleUrl, url),
                url: articleUrl,
                image_url: image,
                published_at: date.toISOString(),
                views: 0
            };
        });

        const filtered = items.filter(item => {
            if (isAd(item.title, item.description)) return false;
            if (isLowQuality(item.title, item.description, item.url)) return false;
            return true;
        });

        feedMemCache.set(url, { data: filtered, timestamp: Date.now() });
        return filtered;
    } catch (error) {
        console.error(`❌ ${url}:`, (error as Error).message);
        return [];
    }
}

async function fetchCategoryNews(category: string): Promise<any[]> {
    const feeds = RSS_FEEDS[category] || [];
    if (feeds.length === 0) return [];
    const promises = feeds.map(async (feedUrl) => {
        await semaphore.acquire();
        try { return await fetchFeed(feedUrl, category); }
        finally { semaphore.release(); }
    });
    const results = await Promise.all(promises);
    const allItems = results.flat();
    const uniqueItems: any[] = [];
    const seen = new Set<string>();
    for (const item of allItems) {
        if (item.url && !seen.has(item.url)) { seen.add(item.url); uniqueItems.push(item); }
    }
    uniqueItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return uniqueItems.slice(0, 25);
}

async function fetchAllNews(): Promise<any[]> {
    const cats = Object.keys(RSS_FEEDS);
    const allItems: any[] = [];
    console.log(`\n🚀 Fetching ${cats.length} categories...`);
    for (const cat of cats) {
        const items = await fetchCategoryNews(cat);
        allItems.push(...items);
        await new Promise(r => setTimeout(r, 300));
    }
    console.log(`✅ Total: ${allItems.length} items`);
    allItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return allItems;
}

// ==================== CACHE: PER-CATEGORY + COMPACT ====================
// Problem: Deno KV has a 65536 bytes limit per value.
// Solution: store cache per category (smaller chunks), and use COMPACT version
// (drop fullContent HTML + image URL path when too long) so it fits.

let globalCache: { data: any[] | null; timestamp: number } = { data: null, timestamp: 0 };
let refreshInProgress = false;

// Strip heavy fields before storing in KV
function makeCompact(items: any[]): any[] {
    return items.map(it => ({
        title: it.title,
        description: it.description,
        // omit full content for KV — frontend shows description in card,
        // and modal can work without full HTML (just shows description again)
        content: "",
        category: it.category,
        importance: it.importance,
        source: it.source,
        url: it.url,
        image_url: it.image_url,
        published_at: it.published_at,
        views: 0
    }));
}

async function saveCacheToKV(allNews: any[]): Promise<void> {
    if (!kv) return;
    try {
        // Group by category
        const byCategory: Record<string, any[]> = {};
        for (const item of allNews) {
            const cat = item.category || "General";
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(item);
        }

        // Save each category separately as compact JSON
        const categories = Object.keys(byCategory);
        const timestamp = Date.now();
        for (const cat of categories) {
            const compact = makeCompact(byCategory[cat]);
            try {
                await kv.set(
                    ["globalCache", cat],
                    { data: compact, timestamp },
                    { expireIn: STALE_TTL }
                );
            } catch (e) {
                console.warn(`Could not save category ${cat} to KV:`, (e as Error).message);
            }
        }

        // Save index (list of categories + timestamp)
        try {
            await kv.set(
                ["globalCacheIndex"],
                { categories, timestamp },
                { expireIn: STALE_TTL }
            );
        } catch (e) {
            console.warn("Could not save index to KV:", (e as Error).message);
        }
        console.log(`💾 Saved ${categories.length} categories to KV`);
    } catch (e) {
        console.warn("saveCacheToKV failed:", e);
    }
}

async function warmCacheFromKV(): Promise<void> {
    if (!kv) return;
    try {
        const indexEntry = await kv.get<{ categories: string[]; timestamp: number }>(["globalCacheIndex"]);
        if (!indexEntry.value) {
            console.log("📭 No cache index in KV");
            return;
        }
        const { categories, timestamp } = indexEntry.value;
        const allItems: any[] = [];
        for (const cat of categories) {
            const entry = await kv.get<{ data: any[]; timestamp: number }>(["globalCache", cat]);
            if (entry.value?.data) allItems.push(...entry.value.data);
        }
        if (allItems.length > 0) {
            allItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
            globalCache = { data: allItems, timestamp };
            const ageS = Math.round((Date.now() - timestamp) / 1000);
            console.log(`🔥 Warmed from KV: ${allItems.length} items across ${categories.length} categories (${ageS}s old)`);
        }
    } catch (e) {
        console.warn("warmCacheFromKV failed:", e);
    }
}

async function refreshGlobalCache(): Promise<void> {
    if (refreshInProgress) return;
    refreshInProgress = true;
    try {
        console.log("🔄 Background refresh starting...");
        const allNews = await fetchAllNews();
        if (allNews.length > 0) {
            globalCache = { data: allNews, timestamp: Date.now() };
            await saveCacheToKV(allNews);
            console.log(`✅ Cache refreshed: ${allNews.length} items`);
        } else {
            console.warn("⚠️ Refresh returned 0 items; keeping old cache");
        }
    } catch (e) {
        console.error("❌ Refresh failed:", e);
    } finally {
        refreshInProgress = false;
    }
}

await warmCacheFromKV();

try {
    Deno.cron("Refresh RSS cache", "*/10 * * * *", async () => { await refreshGlobalCache(); });
    console.log("⏰ Cron scheduled: every 10 minutes");
} catch (_e) {
    console.warn("Deno.cron unavailable; using setInterval fallback");
    setInterval(() => { refreshGlobalCache().catch(console.error); }, 10 * 60 * 1000);
}

if (!globalCache.data) {
    console.log("📭 Cache empty on startup, fetching in background...");
    refreshGlobalCache().catch(console.error);
}

// ==================== HTTP SERVER ====================

Deno.serve(async (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

    if (path === "/health") {
        return new Response(JSON.stringify({
            status: "ok",
            timestamp: Date.now(),
            cacheItems: globalCache.data?.length || 0,
            cacheAge: globalCache.timestamp ? Math.round((Date.now() - globalCache.timestamp) / 1000) : null,
            refreshInProgress,
            kvAvailable: !!kv
        }), { headers });
    }

    if (path === "/api/news" || path === "/news") {
        const category = url.searchParams.get("category") || "all";
        const now = Date.now();
        const age = now - globalCache.timestamp;

        if (globalCache.data && age < CACHE_TTL) {
            let filtered = globalCache.data;
            if (category !== "all") filtered = filtered.filter(i => i.category === category);
            return new Response(JSON.stringify({
                status: "success", cached: true, stale: false,
                total: filtered.length, data: filtered.slice(0, 100),
                timestamp: globalCache.timestamp
            }), { headers });
        }

        if (globalCache.data && age < STALE_TTL) {
            if (!refreshInProgress) refreshGlobalCache().catch(console.error);
            let filtered = globalCache.data;
            if (category !== "all") filtered = filtered.filter(i => i.category === category);
            return new Response(JSON.stringify({
                status: "success", cached: true, stale: true,
                total: filtered.length, data: filtered.slice(0, 100),
                timestamp: globalCache.timestamp
            }), { headers });
        }

        console.log("🔄 No cache; synchronous fetch...");
        await refreshGlobalCache();
        let filtered = globalCache.data || [];
        if (category !== "all") filtered = filtered.filter(i => i.category === category);
        return new Response(JSON.stringify({
            status: "success", cached: false, stale: false,
            total: filtered.length, data: filtered.slice(0, 100),
            timestamp: globalCache.timestamp || now
        }), { headers });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
});
