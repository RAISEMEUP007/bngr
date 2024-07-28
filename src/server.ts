import express from "express";
import dotenv from "dotenv";

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
    const response = await fetch(`https://besttime.app/api/v1/venues?api_key_private=pri_5c4a60134e994498a6214b94b1ee6bf6`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const venueList = await response.json();
    const forecasts = []
    for (const venue of venueList) {
      const params = new URLSearchParams({
        'api_key_private': 'pri_5c4a60134e994498a6214b94b1ee6bf6',
        'venue_id': venue.venue_id
      });

      const res = await fetch(`https://besttime.app/api/v1/forecasts/live?${params}`, {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      forecasts.push(data);
    }

    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

router.use("/", (req, res, next) => {
  console.log('he');
  res.status(404).json({ error: "page not found" });
});

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log(`server is running on ${PORT}`);
});