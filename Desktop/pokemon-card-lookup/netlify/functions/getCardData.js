exports.handler = async (event) => {
    const apiUrl = "https://api.pokemontcg.io/v2/cards";
    const API_KEY = process.env.POKEMON_API_KEY; 
    const { cardName, setCode } = JSON.parse(event.body);

    try {
        const response = await fetch(`${apiUrl}?q=name:"${cardName}" set.id:${setCode}`, {
            headers: { 'X-Api-Key': API_KEY }
        });

        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        console.error("Error fetching card data:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch card data." }) };
    }
};
