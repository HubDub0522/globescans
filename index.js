const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const port = process.env.PORT || 3000;
const parser = new Parser();

app.use(cors());

const rssFeeds = [
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.cnn.com/rss/edition_world.rss",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.reutersagency.com/feed/?best-topics=world"
];

app.get('/search', async (req, res) => {
    const query = req.query.q.toLowerCase();
    let results = [];

    for (let feed of rssFeeds) {
        try {
            const rss = await parser.parseURL(feed);
            const filtered = rss.items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.contentSnippet?.toLowerCase().includes(query)
            ).map(item => ({
                title: item.title,
                link: item.link,
                source: rss.title
            }));

            results = results.concat(filtered);
        } catch (error) {
            console.error(`Error fetching RSS feed: ${feed}`, error);
        }
    }

    res.json(results);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
