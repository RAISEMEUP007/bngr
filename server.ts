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

    const collection = await response.json();
      console.log(collection);
    const poppin = []
    const hot = []
    const dead = []
    for (const venue_id of collection.venue_ids) {
      const params = new URLSearchParams({
        'api_key_private': `${process.env.BESTTIME_PRIVATE_KEY}`,
        'venue_id': venue_id
      });

      const res = await fetch(`https://besttime.app/api/v1/forecasts/live?${params}`, {
        method: 'POST'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      console.log(data);
      if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness >= 100){
        poppin.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: 'Very busy',
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness >= 150){
        poppin.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: 'Not busy',
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness < 100){
        hot.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: 'Very busy',
          Acutal: `Not busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness < 150){
        dead.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: 'Dead',
          Acutal: `Dead (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_live_busyness_available === false){
        dead.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: 'Dead',
          Acutal: `Dead (0%)`,
          Actual_value: 0
        })
      }
      // forecastData.push(data);
    }

    const forecasts = {
      poppin: poppin.sort((a, b)=>b.Actual_value - a.Actual_value),
      hot: hot.sort((a, b)=>b.Actual_value - a.Actual_value),
      dead: dead.sort((a, b)=>b.Actual_value - a.Actual_value),
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