const fetch = require("node-fetch");

exports.handler = async (event) => {
    const EBAY_APP_ID = process.env.EBAY_APP_ID; // Stored securely
    const query = JSON.parse(event.body).query;

    const ebayUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=5`;

    try {
        const response = await fetch(ebayUrl, {
            headers: {
                "Authorization": `Bearer ${process.env.EBAY_OAUTH_TOKEN}`,
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US"
            }
        });
        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch eBay data" }) };
    }
};
