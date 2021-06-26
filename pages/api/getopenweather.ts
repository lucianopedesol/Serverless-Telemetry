import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { WeatherData } from '../../models/weather-data';

async function getWeather(cityId: Number): Promise<WeatherData> {
  const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=pt_br&appid=${process.env.OPENWEATHERPASS}`);

  if(data?.cod == 200){
    const retFirstWeather = weatherData(data);
    return retFirstWeather;
  } else {
    return null;
  }
}

function weatherData(weatherParm): WeatherData{
  const weatherData: WeatherData = new WeatherData().toModel({
    temperature: weatherParm?.main?.temp,
    temperatureFeelsLike: weatherParm?.main?.feels_like,
    temperatureMin: weatherParm?.main?.temp_min,
    temperatureMax: weatherParm?.main?.temp_max,
    pressure: weatherParm?.main?.pressure,
    humidity: weatherParm?.main?.humidity,
    windSpeed: (weatherParm?.wind?.speed * 3.6).toFixed(2),
    windDeg: weatherParm?.wind?.deg,
    weatherDescription: weatherParm?.weather[0]?.description
   });
   return weatherData;
}

export default async (request: VercelRequest, response: VercelResponse) => {  
  const { id } = request.query;
  let resp = await getWeather(+id);
  return response.status(201).json(resp);
}