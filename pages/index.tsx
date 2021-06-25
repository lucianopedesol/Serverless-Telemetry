// import Head from 'next/head'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Flex, Image, Button, Text } from '@chakra-ui/core'
import Input from '../components/Input'
import axios from 'axios'

import CardInformation from '../components/card-information';
import CardGraph from '../components/card-graph';

import { WeatherData } from '../models/weather-data';

export interface HUMIDITY {
  subscribeAt: string,
  value: Number,
}

export interface TEMPERATURE {
  subscribeAt: string,
  value: Number,
}



let countDownTimeout: NodeJS.Timeout;
export default function Home() {
  const isMount = useRef(true);
  const isAwait = useRef(true);

  const [humidity, setHumidity] = useState<any>([])
  const [lastHumidity, setLastHumidity] = useState<any>([])
  const [lastTemperature, setLastTemperature] = useState<any>([])
  const [lastRain, setLastRain] = useState<any>()
  const [temperature, setTemperature] = useState<any>([])
  const [isDataLoad, setIsDataLoad] = useState(false);

  const [weatherResponse, setWeatherResponse] = useState<WeatherData>(null);

  function convertDateTimeToDataHora(dateParm: string): string{
    let dia = dateParm.substring(8,10);
    let mes = dateParm.substring(5,7);
    let ano = dateParm.substring(0,4);

    let hora = dateParm.substring(11,13);
    let minuto = dateParm.substring(14,16);
    let segundo = dateParm.substring(17,19);

    let dataHoraCompleta = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}.000Z`;
    let dataHora = new Date(dataHoraCompleta);    

    return dataHora.toLocaleTimeString("pt-BR").substring(0,5);
  }

  async function getWeather(): Promise<WeatherData> {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/find?q=Cariacica&units=metric&lang=pt_br&appid=a0d8bd1b726d4aa647314a354d4aea55');

    if(data?.list?.length > 0){
      const retFirstWeather = weatherData(data?.list[0]);
      console.log("Data", retFirstWeather);
      return retFirstWeather;
    } else {
      console.log("Sem dados");
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

  async function get() {
    isAwait.current = false;
    const { data } = await axios.get('/api/getvalues');
    let h: any = [['Hora', 'Umidade']];
    let t: any = [['Hora', 'Temperatura']];
    for (let i of data.humidity) {
      h.push([convertDateTimeToDataHora(i.subscribeAt), Number(i.value)]);
    }
    
    for (let i of data.temperature) {
      t.push([convertDateTimeToDataHora(i.subscribeAt), Number(i.value)]);
    }
    
    setLastRain(data?.rain[0]?.value);

    console.log("Rain", data?.rain[0]?.value);
    setHumidity(h);
    setTemperature(t);
    setLastHumidity(h[h.length-1][1]);
    setLastTemperature(t[t.length-1][1]);
    isAwait.current = true;
    setIsDataLoad(true);
  };

  useEffect(() => {
    if (isMount.current)
      getWeather().then(resp => {
        setWeatherResponse(resp);
      });
      
      get();

      setInterval(() => {
        if (isAwait.current) {
          get();
        }
      }, 15000)

    return () => {
      isMount.current = false
      clearTimeout(countDownTimeout);
    }
  }, [])

  return (
    <Flex
      as="main"
      justifyContent="center"
      flexDir="column"
      alignItems="center"
      padding={8}
      marginTop={4}
    >
      <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir={{base: "column", lg: "row"}}
        alignItems="stretch"
        justifyContent="space-around"
        padding={8}
        marginTop={4}
        width="95%"
      >
        <CardInformation type="H" label="Umidade" value={lastHumidity}/>
        <CardInformation type="C" label="Clima" value={weatherResponse} sensorValue={lastRain}/>
        <CardInformation type="T" label="Temperatura" value={lastTemperature}/>
      </Flex>

      <CardGraph label="Umidade" data={humidity} isDataLoad={isDataLoad} />
      <CardGraph label="Temperatura" data={temperature} isDataLoad={isDataLoad} />
     
    </Flex>

  )
}
