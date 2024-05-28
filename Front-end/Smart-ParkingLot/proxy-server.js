import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const port = 5000;

app.use(cors());

app.get('/autocomplete', async (req, res) => {
  const { input } = req.query;
  const apiKey = 'AIzaSyC0c45KPuqZ2kVQcNWU89SLAj0m7DhKQ-A';
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&location=47.1585,27.6014&radius=10000&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('[Proxy Server] Failed to fetch from Google Places API:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Proxy Server running on http://localhost:${port}`);
});
