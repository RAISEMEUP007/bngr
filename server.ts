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

router.get("/getforecastdata/", async (req, res, next) => {
  try {
    const venueIds =  [
        "ven_736c6e4364306f71765370526b6f775956396c4b4734624a496843",
        "ven_63595a5862666554464452526b6f775a6869544138562d4a496843",
        "ven_384c335153306872475932526b4936716f50446e4c38534a496843",
        "ven_3848695f306e5636397969526b6f775a4e535a696a51364a496843",
        "ven_3034337a76417451307736526b6f775a527966635878344a496843",
        "ven_4d547158557150414d706b526b493633497078786766534a496843",
        "ven_34352d722d676d56726543526b6f772d6c2d30754863674a496843",
        "ven_4178654d486b6d6a67644a526b6f775a7043516d7756774a496843",
        "ven_345149714b787367675630526b6f775a525342646a52544a496843",
        "ven_45637941444d66754b6d66526b6f775a5a5f624a78304c4a496843",
        "ven_345f5a44627451554c6a45526b6f775a5a7974554332414a496843",
        "ven_514a397a535a6d5a697653526b6f7741326266767277784a496843",
        "ven_67784476647462724c7368526b6f7741694175376d32674a496843",
        "ven_49304246334f54326a556f526b6f7766645564673131364a496843",
        "ven_6b56555a373354774c6e52526b6f777639496d3167394b4a496843",
        "ven_51527a4569414950664269526b493673677249486131314a496843",
        "ven_41775a4d5934576e475945526b6f7748616d44477255534a496843",
        "ven_51315367584174464e2d64526b6f775a784f77306b57484a496843",
        "ven_736c6e4364306f71765370526b6f775956396c4b4734624a496843",
        "ven_63595a5862666554464452526b6f775a6869544138562d4a496843",
        "ven_384c335153306872475932526b4936716f50446e4c38534a496843",
        "ven_3848695f306e5636397969526b6f775a4e535a696a51364a496843",
        "ven_3034337a76417451307736526b6f775a527966635878344a496843",
        "ven_4d547158557150414d706b526b493633497078786766534a496843",
        "ven_34352d722d676d56726543526b6f772d6c2d30754863674a496843",
        "ven_4178654d486b6d6a67644a526b6f775a7043516d7756774a496843",
        "ven_345149714b787367675630526b6f775a525342646a52544a496843",
        "ven_45637941444d66754b6d66526b6f775a5a5f624a78304c4a496843",
        "ven_345f5a44627451554c6a45526b6f775a5a7974554332414a496843",
        "ven_514a397a535a6d5a697653526b6f7741326266767277784a496843",
        "ven_67784476647462724c7368526b6f7741694175376d32674a496843",
        "ven_49304246334f54326a556f526b6f7766645564673131364a496843",
        "ven_6b56555a373354774c6e52526b6f777639496d3167394b4a496843",
        "ven_51527a4569414950664269526b493673677249486131314a496843",
        "ven_41775a4d5934576e475945526b6f7748616d44477255534a496843",
        "ven_51315367584174464e2d64526b6f775a784f77306b57484a496843",
        "ven_736c6e4364306f71765370526b6f775956396c4b4734624a496843",
        "ven_63595a5862666554464452526b6f775a6869544138562d4a496843",
        "ven_384c335153306872475932526b4936716f50446e4c38534a496843",
        "ven_3848695f306e5636397969526b6f775a4e535a696a51364a496843",
        "ven_3034337a76417451307736526b6f775a527966635878344a496843",
        "ven_4d547158557150414d706b526b493633497078786766534a496843",
        "ven_34352d722d676d56726543526b6f772d6c2d30754863674a496843",
        "ven_4178654d486b6d6a67644a526b6f775a7043516d7756774a496843",
        "ven_345149714b787367675630526b6f775a525342646a52544a496843",
        "ven_45637941444d66754b6d66526b6f775a5a5f624a78304c4a496843",
        "ven_345f5a44627451554c6a45526b6f775a5a7974554332414a496843",
        "ven_514a397a535a6d5a697653526b6f7741326266767277784a496843",
        "ven_67784476647462724c7368526b6f7741694175376d32674a496843",
        "ven_49304246334f54326a556f526b6f7766645564673131364a496843",
        "ven_6b56555a373354774c6e52526b6f777639496d3167394b4a496843",
        "ven_51527a4569414950664269526b493673677249486131314a496843",
        "ven_41775a4d5934576e475945526b6f7748616d44477255534a496843",
        "ven_51315367584174464e2d64526b6f775a784f77306b57484a496843",
        "ven_5175544470547361733136526b6f7776707651715752734a496843",
        "ven_55343942486b665f6a6851526b6f7776745758636978354a496843",
        "ven_3073645f63656e33696c56526b6f77765234764c5f514d4a496843",
        "ven_73696d36376445664c3766526b6f777652596f6c467a5f4a496843",
        "ven_416f553158315f65723858526b6f77764a5931756236484a496843",
        "ven_517135534b706859314e62526b6f7776522d6b4f5155504a496843",
        "ven_6b5a4b636530553054484e526b6f77764e594d713337364a496843",
        "ven_3031546876456c505a445a526b6f7776706d324f5364794a496843",
        "ven_343568726b537030646f57526b6f7776396f6a626e5f484a496843",
        "ven_63315035387930476a6b76526b6f77774241656356526a4a496843",
        "ven_6f59774642387156646172526b6f77765a505f6e5754754a496843",
        "ven_67614f5f6a522d686d534e526b6f77765259704d5a35574a496843",
        "ven_3837467067544d6f6b4554526b6f7776645f6459645f394a496843",
        "ven_306769745f54667963396b526b6f7776686654444a55684a496843",
        "ven_6b56555a373354774c6e52526b6f777639496d3167394b4a496843",
        "ven_517731765f7a33496a6f4e526b49367134377865762d524a496843",
        "ven_515669545a3644586d6e70526b6f7765787333546856374a496843",
        "ven_4d43446841334449397936526b49367a343134507a36544a496843",
        "ven_304d67466a674f35447a64526b6f7739396c465a6d566b4a496843",
        "ven_77553464766b4e32497479526b6f77373530576c4d2d7a4a496843",
        "ven_4978564e78354f72595377526b493635676850435430484a496843",
        "ven_495f5f63426a6561714c37526b49364a46454e615532794a496843",
        "ven_3071633739465959507a57526b493673514e323532302d4a496843",
        "ven_6331466939484f72674572526b4936365942654762786b4a496843",
        "ven_515a62383558485f315045526b49366c775065724e37364a496843",
        "ven_3848695f306e5636397969526b6f775a4e535a696a51364a496843",
        "ven_63666a59444a69556b4e68526b4936794d6673666d66724a496843",
        "ven_6f3347704b774d724e775a526b4936794d5f5f554f31334a496843",
        "ven_3058504f50656d5844466b526b493664525373382d58554a496843",
        "ven_6774454b58486e4769324e526b49364a68427635365a334a496843",
        "ven_4d3865346d3061746d3558526b49364f3563732d3155514a496843",
        "ven_3054797937555270496243526b4936746f79547a6e306e4a496843",
        "ven_736c6e4364306f71765370526b6f775956396c4b4734624a496843",
        "ven_3459354f33653236473249526b6f77442d4c39495f54374a496843",
        "ven_4970673679483168703947526b6f775a464c45666a66784a496843",
        "ven_41775a4d5934576e475945526b6f7748616d44477255534a496843",
        "ven_514a397a535a6d5a697653526b6f7741326266767277784a496843",
        "ven_45637941444d66754b6d66526b6f775a5a5f624a78304c4a496843",
        "ven_4d547158557150414d706b526b493633497078786766534a496843",
        "ven_736c6e4364306f71765370526b6f775956396c4b4734624a496843",
        "ven_63595a5862666554464452526b6f775a6869544138562d4a496843",
        "ven_384c335153306872475932526b4936716f50446e4c38534a496843",
        "ven_3848695f306e5636397969526b6f775a4e535a696a51364a496843",
        "ven_3034337a76417451307736526b6f775a527966635878344a496843",
        "ven_34352d722d676d56726543526b6f772d6c2d30754863674a496843",
        "ven_4178654d486b6d6a67644a526b6f775a7043516d7756774a496843",
        "ven_345149714b787367675630526b6f775a525342646a52544a496843",
        "ven_345f5a44627451554c6a45526b6f775a5a7974554332414a496843",
        "ven_67784476647462724c7368526b6f7741694175376d32674a496843",
        "ven_49304246334f54326a556f526b6f7766645564673131364a496843",
        "ven_6b56555a373354774c6e52526b6f777639496d3167394b4a496843",
        "ven_51527a4569414950664269526b493673677249486131314a496843",
        "ven_51315367584174464e2d64526b6f775a784f77306b57484a496843",
        "ven_776965762d6867666e305a526b493674416a516f3236584a496843",
        "ven_67784476647462724c7368526b6f7741694175376d32674a496843",
        "ven_496d5f55613742444a426d526b6f7739357855344166374a496843",
        "ven_49725a506a62524d686f75526b6f77485368756f5852514a496843",
        "ven_344d364d684446586b4e36526b493670676564684a324a4a496843",
        "ven_77794f695f647853416179526b6f775a6c6d4a4b7862594a496843",
        "ven_5947555f6d564855733045526b6f7766357a667652655f4a496843",
        "ven_6f54647371724e7256365a526b4936496c7667723662764a496843",
        "ven_73614f3341644f41356c50526b6f77666c4b46725978514a496843",
        "ven_4135724d5736436e426164526b6f775a5a4573626561594a496843",
        "ven_386f3478785a6643727677526b6f7748796656566779384a496843",
        "ven_7731646654366e712d3168526b59364b72714f767030664a496843",
        "ven_5574334946497736343164526b6f77666c615f375651344a496843",
        "ven_67542d7249526456473252526b4936324d6e797131586d4a496843",
        "ven_6b6e6a343979564d417930526b6f776c353634446d5f634a496843",
        "ven_49566e59426d75586f3038526b6f7766526973333277644a496843",
        "ven_387838476c45736a535179526b6f776574364e394432374a496843",
        "ven_7738346457323937785568526b6f77675a374f323539314a496843",
        "ven_675a3230733850586d6e4a526b6f77393952474167315a4a496843",
        "ven_5943577a634c31316d7275526b6f7766704265425339424a496843",
        "ven_4d45366a325f7849673961526b49367745755f6b6d54644a496843",
        "ven_6b6a7135323035595f374e526b6f77413632594a6965634a496843",
        "ven_386e3663424a4473427a74526b6f775a4e7a58543378494a496843",
        "ven_45374142497361562d3565526b6f7748696d786779567a4a496843",
        "ven_385646474c31536b43356a526b6f77667879664b4534364a496843"
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

router.get("/getforecasts/", async (req, res, next) => {
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