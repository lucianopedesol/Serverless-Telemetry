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

  const db = await connectToDatabase(process.env.CONNECTIONSTRING);

  const humidityCollection = db.collection('humidity');
  const temperatureCollection = db.collection('temperature');

  const humidityData = humidityCollection.find();
  const temperatureData = temperatureCollection.find();

  await Promise.all([
    humidityData.forEach(e => listHumidity.push(e)),
    temperatureData.forEach(e => listTemperature.push(e))

  ]).then((values) => {
    return response.status(201).json({
      humidity: listHumidity,
      temperature: listTemperature
    });

  });

}
