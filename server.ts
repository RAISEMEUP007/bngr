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

const cities = [
  {
    id: 1,
    name: 'Atlanta',
    shortName: '',
    collection_id: '',
  },
  {
    id: 2,
    name: 'Boston',
    shortName: 'bos',
    collection_id: 'col_5888e3bbcd7c4a87a803f078e4e2b16c',
  },
  {
    id: 3,
    name: 'Chicago',
    collection_id: '',
  },
  {
    id: 4,
    name: 'Las Vegas',
    collection_id: '',
  },
  {
    id: 5,
    name: 'Los Angeles',
    collection_id: '',
  },
  {
    id: 6,
    name: 'Miami',
    collection_id: '',
  },
  {
    id: 7,
    name: 'Nashuille',
    collection_id: '',
  },
  {
    id: 8,
    name: 'New York',
    shortName: 'nyc',
    collection_id: 'col_85588aba7d7646a2bab167fa428c73ee',
  },
  {
    id: 9,
    name: 'Washington D.C.',
    collection_id: '',
  },
  {
    id: 10,
    name: 'San francisco',
    shortName: 'sf',
    collection_id: 'col_0a97efad53044688b4b329b0d1b4a871',
  },
  {
    id: 11,
    name: 'Manhattan',
    shortName: 'man',
    collection_id: 'col_35f814e1a77d4edea9bbb69ccc16c83a',
  }
]

router.get("/getcities/", async (req, res, next) => {
  try {
    const filteredCities = cities.filter(city => city.collection_id !== '').sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(filteredCities);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

router.get("/getforecastdata/", async (req, res, next) => {
  try {
    const venueIds =  [
      "ven_774b556c58696a70505044526b6f77595a4b35324258624a496843",
      "ven_7773377638485a61394649526b6f7732505144454e62784a496843",
      "ven_3850385f37316774625573526b6f7759563662553457414a496843",
      "ven_4972425749544f77684334526b6f7731585172473077654a496843",
      "ven_596c535546457963347131526b6f77595a363448795f364a496843",
      "ven_454e6d6f6c65304345624d526b6f77333365584c3763614a496843",
      "ven_77654c504c747933714459526b6f77335f5a415f6635304a496843",
      "ven_774771726a474844675172526b6f77324c7773496f344e4a496843",
      "ven_4d625431422d7a646e7058526b6f7731727633743056754a496843",
      "ven_5954663154524c356d4846526b6f775a564c69456b5f334a496843",
      "ven_4543775a6f6a5f63694764526b6f775a5a3462473637494a496843",
      "ven_737962587a785453614e42526b6f7733485f73443862434a496843",
      "ven_4d54745076475563326b64526b6f7732725764335566334a496843",
      "ven_4161326469624d4d2d7761526b6f773344394e504757724a496843",
      "ven_63635a7979655934567545526b6f773262686c72442d5a4a496843",
      "ven_6b734e77726c3537363066526b6f7759707259465a66534a496843",
      "ven_63534f7055622d5656484f526b6f77314463414a6b59584a496843",
      "ven_6f49357955416d76313246526b6f7733487962577437654a496843",
      "ven_5150624c6a68326b363576526b6f7759705f46484f5a724a496843",
      "ven_6b396f597444746b53514f526b6f775a4a4a4b56347a6a4a496843",
      "ven_414c4630334f465130554f526b6f775a564b374561376f4a496843",
      "ven_4d6771504a386b73593255526b6f77594a6c74785a314a4a496843",
      "ven_6371656673615748465153526b6f775956567a6c3833714a496843",
      "ven_3048364c6c6761512d4731526b6f775a4e3473744477514a496843",
      "ven_6f6e364f72584139767970526b6f775a354a66443832444a496843",
      "ven_4565336d53493068333574526b6f775a464a693266304e4a496843",
      "ven_457471374f7a794d765966526b6f775a743564534364474a496843",
      "ven_5567307339746253524c5f526b6f775a685979425136564a496843",
      "ven_7376465453626a52313337526b6f7759392d6730475a314a496843",
      "ven_73495a53552d4675774a64526b6f775a464a47394a36354a496843",
      "ven_7772586478783665564268526b6f775a354b75373835384a496843",
      "ven_6f52564a38357a48774350526b6f775a786d7673497a474a496843",
      "ven_345646524b414439515350526b6f775a4e79326c6c33754a496843",
      "ven_384b4a7059476d6b6f4544526b6f775a7836494b69554d4a496843",
      "ven_776c743345486f56525a35526b6f775a4a495467685a524a496843",
      "ven_5975315a4d482d306a6577526b6f775a464d76646651484a496843",
      "ven_517651626d4832424e4b4e526b6f775a644567515530474a496843",
      "ven_4d596a734f486d56303556526b6f7759684648533565744a496843",
      "ven_30546776577234625f4871526b6f77596c5032755131664a496843",
      "ven_41526561675a38725a5779526b6f775a313541794b32424a496843",
      "ven_345646524b414439515350526b6f775a4e79326c6c33754a496843",
      "ven_6f5530383261697477555a526b6f77595a6c5f636778474a496843",
      "ven_6f52564a38357a48774350526b6f775a786d7673497a474a496843",
      "ven_4178654d486b6d6a67644a526b6f775a7043516d7756774a496843",
      "ven_4d68584434415a4f505163526b6f775a464144614e61544a496843",
      "ven_6f55343168503164715f33526b6f775a74564165467a684a496843",
      "ven_45704d7938554c6b58594a526b6f77616c7964525865564a496843",
      "ven_556e4d686f646259475335526b6f77596456344a3233524a496843",
      "ven_5154365f74514a6a555947526b6f775a68327276495f734a496843",
      "ven_4957704334414c64706d50526b6f77594a6c537265784f4a496843",
      "ven_7350755a39635835536239526b6f775a684b5f457457764a496843",
      "ven_636b5f593748477761484a526b6f775a4a714942392d774a496843",
      "ven_414176617137494b4a5544526b6f7759686647637334594a496843",
      "ven_67334d43444a5a397a5f6f526b6f7759565646332d7a714a496843",
      "ven_6368773477726f61515f4b526b6f775a526c444f6358314a496843",
      "ven_6f2d617134383951794b32526b6f77615252614a6952494a496843",
      "ven_774e3352564b6b6365446e526b6f775a705963466e55544a496843",
      "ven_51717a62396a4c656f7970526b6f775a42735a33392d4e4a496843",
      "ven_4959674f706e784c6e4a70526b6f775a4a49716e6478614a496843",
      "ven_4d36324849655779657239526b6f7759525653786656594a496843",
      "ven_7759772d593646746c6641526b6f775a3537333756524d4a496843",
      "ven_633036386d4d7031366670526b6f775a6472476c6e77424a496843",
      "ven_4d30386b56504872316f41526b6f775a5a6b6e454233724a496843",
      "ven_30356a726731795244452d526b6f775a425955664335434a496843",
      "ven_41514c3167523878764755526b6f775a74634c2d7859524a496843",
      "ven_77794f695f647853416179526b6f775a6c6d4a4b7862594a496843"
    ]
    const poppin = []
    const hot = []
    const dead = []
    for (const venue_id of venueIds) {
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
      if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness >= 100){
        poppin.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: `Very busy (${data.analysis.venue_forecasted_busyness || 0}%)`,
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness >= 150){
        poppin.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: `Not busy (${data.analysis.venue_forecasted_busyness || 0}%)`,
          Acutal: `Extremely busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness >= 100 && data.analysis.venue_live_busyness < 100){
        hot.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: `Very busy (${data.analysis.venue_forecasted_busyness || 0}%)`,
          Acutal: `Not busy (${data.analysis.venue_live_busyness}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_forecasted_busyness < 100 && data.analysis.venue_live_busyness < 150){
        dead.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: `Dead (${data.analysis.venue_forecasted_busyness || 0}%)`,
          Acutal: `Dead (${data.analysis.venue_live_busyness || 0}%)`,
          Actual_value: data.analysis.venue_live_busyness
        })
      }else if(data.analysis.venue_live_busyness_available === false){
        dead.push({
          venue_id: venue_id,
          venue_name: data.venue_info.venue_name,
          forecast: `Dead (${data.analysis.venue_forecasted_busyness || 0}%)`,
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

router.get("/getforecasts/", async (req, res, next) => {
  try {
    const { city_id } = req.query;
    const city:any = cities.find((city:any) => city.id == city_id);
    const collection_id = city.collection_id;
    const collectionURL = `https://besttime.app/api/v1/collection/${collection_id}?api_key_private=${process.env.BESTTIME_PRIVATE_KEY}`;
    console.log(collectionURL);
    const response = await fetch(collectionURL, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const collection = await response.json();
    const poppin = []
    const hot = []
    const dead = []
    for (const venue_id of collection.venue_ids) {
      const params = new URLSearchParams({
        'api_key_private': `${process.env.BESTTIME_PRIVATE_KEY}`,
        'venue_id': venue_id
      });

      const forecasts:any = await fetch(`https://besttime.app/api/v1/forecasts?${params}`, {
        method: 'POST'
      });
      // console.log(`https://besttime.app/api/v1/forecasts?${params}`);
      if (!forecasts.ok) {
        throw new Error('Failed to fetch data');
      }
      const forecastsData = await forecasts.json();

      const live = await fetch(`https://besttime.app/api/v1/forecasts/live?${params}`, {
        method: 'POST'
      });
      if (!live.ok) {
        throw new Error('Failed to fetch data');
      }
      const liveData = await live.json();

      let today = new Date();
      let todayWeekDay = today.getDay();
      todayWeekDay = (todayWeekDay + 6) % 7;

      let status = 'other';
      if(liveData.analysis.venue_live_busyness > 80 || liveData.analysis.venue_live_forecasted_delta > 80) status = 'hot';
      else if(forecastsData?.analysis[todayWeekDay]?.day_raw.some((item:number) => item>80)) status = 'forecasted';
      else if(liveData?.analysis?.venue_live_busyness_available == 'no') status = 'closed';

      switch(status){
        case 'hot':
          poppin.push({
            venue_id: venue_id,
            venue_name: liveData.venue_info.venue_name,
            forecast: `Very busy (${Math.max(...forecastsData.analysis[todayWeekDay].day_raw) || 0}%)`,
            Acutal: `Extremely busy (${liveData?.analysis?.venue_live_busyness??0}%)`,
            Actual_value: liveData?.analysis?.venue_live_busyness??0
          })
          break;
        case 'forecasted':
          hot.push({
            venue_id: venue_id,
            venue_name: liveData.venue_info.venue_name,
            forecast: `Very busy (${Math.max(...forecastsData.analysis[todayWeekDay].day_raw) || 0}%)`,
            Acutal: `Not busy (${liveData?.analysis?.venue_live_busyness??0}%)`,
            Actual_value: liveData?.analysis?.venue_live_busyness??0
          })
          break;
        case 'other':
          dead.push({
            venue_id: venue_id,
            venue_name: liveData.venue_info.venue_name,
            forecast: `Dead (${Math.max(...forecastsData.analysis[todayWeekDay].day_raw) || 0}%)`,
            Acutal: `Dead (${liveData?.analysis?.venue_live_busyness??0}%)`,
            Actual_value: liveData?.analysis?.venue_live_busyness??0
          })
          break;
      }
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