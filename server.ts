import express from "express";
import dotenv from "dotenv";
const https = require('https');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const router = express.Router();

router.use("/getforecastdata/", async (req, res, next) => {
  try {
    const response = await fetch(`https://besttime.app/api/v1/collection/${process.env.COLLECTION_ID}?api_key_private=${process.env.BESTTIME_PRIVATE_KEY}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const venueList = await response.json();
    const poppin = []
    const hot = []
    const dead = []
    for (const venue of venueList) {
      const params = new URLSearchParams({
        'api_key_private': `${process.env.BESTTIME_PRIVATE_KEY}`,
        'venue_id': venue.venue_id
      });

      const res = await fetch(`https://besttime.app/api/v1/forecasts/live?${params}`, {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness >= 100){
        poppin.push({
          venue_id: venue.venue_id,
          venue_name: venue.venue_name,
          forecast: 'Very busy',
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness >= 150){
        poppin.push({
          venue_id: venue.venue_id,
          venue_name: venue.venue_name,
          forecast: 'Not busy',
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness < 100){
        hot.push({
          venue_id: venue.venue_id,
          venue_name: venue.venue_name,
          forecast: 'Very busy',
          Acutal: `Not busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness < 150){
        dead.push({
          venue_id: venue.venue_id,
          venue_name: venue.venue_name,
          forecast: 'Dead',
          Acutal: `Dead (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }
      // forecastData.push(data);
    }

    const forecasts = {
      poppin,
      hot,
      dead,
    }

    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

router.use("/", (req, res, next) => {
  res.status(404).json({ error: "page not found" });
});

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log(`server is running on ${PORT}`);
});