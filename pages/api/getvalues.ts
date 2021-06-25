import { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb'
import url from 'url'
let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
  if (cachedDb)
    return cachedDb;

  const client = await MongoClient.connect(uri, {
    //disabled warnings
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const dbName = url.parse(uri).pathname.substr(1);

  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

export default async (request: VercelRequest, response: VercelResponse) => {

  let listHumidity = [];
  let listTemperature = [];
  let listRain = [];

  const db = await connectToDatabase(process.env.CONNECTIONSTRING);

  const humidityCollection = db.collection('humidity');
  const temperatureCollection = db.collection('temperature');
  const rainCollection = db.collection('rain');

  const humidityData = humidityCollection.find().sort({subscribeAt:-1}).limit(10);
  const temperatureData = temperatureCollection.find().sort({subscribeAt:-1}).limit(10);
  const rainData = rainCollection.find().sort({subscribeAt:-1}).limit(1);

  await Promise.all([
    humidityData.forEach(e => listHumidity.push(e)),
    temperatureData.forEach(e => listTemperature.push(e)),
    rainData.forEach(e => listRain.push(e))
  ]).then((values) => {
    listHumidity = listHumidity.reverse();
    listTemperature = listTemperature.reverse();

    return response.status(201).json({
      humidity: listHumidity,
      temperature: listTemperature,
      rain: listRain
    });

  });

}
