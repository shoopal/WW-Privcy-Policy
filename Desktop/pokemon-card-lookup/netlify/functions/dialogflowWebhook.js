exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const body = JSON.parse(event.body);
        const intent = body.queryResult.intent.displayName;
        let responseText = "I couldn't find that card. Try again with a different name or set.";

        if (intent === "LookupCard") {
            const cardName = body.queryResult.parameters.cardName; // Extract card name
            const setCode = body.queryResult.parameters.setCode; // Extract set name

            if (!cardName || !setCode) {
                responseText = "Please provide both the card name and the set.";
            } else {
                // Fetch Pokémon card data by NAME instead of NUMBER
                const cardResponse = await fetch(`/.netlify/functions/getCardData`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cardName, setCode }) // Sending the correct parameters
                });

                const cardData = await cardResponse.json();

                if (cardData && cardData.data && cardData.data.length > 0) {
                    const card = cardData.data[0];
                    responseText = `Card: ${card.name}, Set: ${card.set.name}, Price: $${card.tcgplayer?.prices?.market?.toFixed(2) || "N/A"}.`;
                } else {
                    responseText = `I couldn't find a card named ${cardName} in ${setCode}. Please check the name and try again.`;
                }
            }
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fulfillmentText: responseText })
        };

    } catch (error) {
        console.error("Webhook error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fulfillmentText: "An error occurred while looking up the card. Please try again later." })
        };
    }
};
