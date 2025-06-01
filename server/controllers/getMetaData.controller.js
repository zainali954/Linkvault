// ─── Imports ──────────────────────────────────────────────
import { JSDOM } from 'jsdom';
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Helper Functions ─────────────────────────────────────
function cleanTitle(title = '') {
    const simplified = title.split(/[-|–]/)[0].trim();
    return simplified.charAt(0).toUpperCase() + simplified.slice(1);
}

async function getWebsiteMetadata(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const title = doc.querySelector('title')?.textContent || '';
        const description =
            doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        return {
            title: cleanTitle(title),
            description: description || title
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: '', description: '' };
    }
}

async function getWebsiteFavicon(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const faviconLink =
            doc.querySelector('link[rel="icon"]') ||
            doc.querySelector('link[rel="shortcut icon"]') ||
            doc.querySelector('link[rel="apple-touch-icon"]');

        if (faviconLink?.href) {
            return new URL(faviconLink.href, url).href;
        }

        return new URL('/favicon.ico', url).href;
    } catch (error) {
        console.error('Error fetching favicon:', error);
        return '';
    }
}

// ─── Controllers ──────────────────────────────────────────

export const getWebData = asyncHandler(async (req, res) => {
    const { url } = req.body;

    const metaData = await getWebsiteMetadata(url);
    const favicon = await getWebsiteFavicon(url);

    apiResponse.success(res, "Fetched", {
        title: metaData.title,
        description: metaData.description,
        favicon
    });
});
