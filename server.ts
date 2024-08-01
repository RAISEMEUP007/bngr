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
    // const response = await fetch(`https://besttime.app/api/v1/venues?api_key_private=pri_5c4a60134e994498a6214b94b1ee6bf6`, {
    //   method: 'GET'
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to fetch data');
    // }

    // const venueList = await response.json();
    // const forecasts = []
    // for (const venue of venueList) {
    //   const params = new URLSearchParams({
    //     'api_key_private': 'pri_5c4a60134e994498a6214b94b1ee6bf6',
    //     'venue_id': venue.venue_id
    //   });

    //   const res = await fetch(`https://besttime.app/api/v1/forecasts/live?${params}`, {
    //     method: 'POST'
    //   });

    //   if (!res.ok) {
    //     throw new Error('Failed to fetch data');
    //   }

    //   const data = await res.json();
    //   forecasts.push(data);
    // }

    const forecasts = {
      poppin: [
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (147%)',
          Actual_value: 180
        },
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (147%)',
          Actual_value: 160
        }
      ],
      hot: [
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (70%)',
          Actual_value: 70
        },
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (60%)',
          Actual_value: 60
        },
      ],
      dead: [
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (40%)',
          Actual_value: 40
        },
        {
          venue_name: 'E11even Miami',
          forecast: 'Very busy',
          Acutal: 'Extremely busy (30%)',
          Actual_value: 30
        },
      ],
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

const PORT = process.env.PORT || 80;

// const options = {
//   key: fs.readFileSync(process.env.PRIVATEKEY_PATH),
//   cert: fs.readFileSync(process.env.CERT_PATH),
// };

// console.log(options);

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});