// import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { Flex, Select  } from '@chakra-ui/core'
import axios from 'axios'

import CardInformation from '../components/card-information';
import CardGraph from '../components/card-graph';
import CardHeader from '../components/card-header';

import { WeatherData } from '../models/weather-data';

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
  const [cityId, setCityId] = useState("3466954");

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

  async function getWeather(cityIdParm): Promise<WeatherData> {
    const { data } = await axios.get(`/api/getopenweather?id=${cityIdParm}`);

    if(data){
      return data;
    } else {
      return null;
    }
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

    setHumidity(h);
    setTemperature(t);
    setLastHumidity(h[h.length-1][1]);
    setLastTemperature(t[t.length-1][1]);
    isAwait.current = true;
    setIsDataLoad(true);
  };

  useEffect(() => {
    getWeather(cityId).then(resp => {
      setWeatherResponse(resp);
    });
    
    get();

    if (isMount.current){
      setInterval(() => {
        if (isAwait.current) {
          get();
        }
      }, 30000)
    }

    return () => {
      isMount.current = false
      clearTimeout(countDownTimeout);
    }

  }, [])

  async function changeValue(event){
    let cityIdParm = event.target.value;
    setCityId(cityIdParm);

    let resp = await getWeather(cityIdParm);

    setWeatherResponse(resp);
  }

  return (
    <Flex
      as="main"
      justifyContent="center"
      flexDir="column"
      alignItems="center"
      padding={8}
      marginTop={4}
    >
      <CardHeader/>

      <Flex
        backgroundColor="gray.700"
        flexDir="column"
        borderRadius="md"
        padding={4}
        marginTop={2}
        width="100%"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
        >
          <Select 
            bg="purple.500"
            width={{base:"100%", md: "30%"}}
            onChange={(e) => changeValue(e)}
            value={cityId}
          >
            <option value="3466954">Cariacica - ES</option>
          </Select>
        </Flex>
        
        <Flex
          flexDir={{base: "column", lg: "row"}}
          alignItems="stretch"
          justifyContent="space-around"
        >
          <CardInformation type="H" label="Umidade" value={lastHumidity}/>
          <CardInformation type="C" label="Clima" value={weatherResponse} sensorValue={lastRain}/>
          <CardInformation type="T" label="Temperatura" value={lastTemperature}/>
        </Flex>
        
      </Flex>

      <CardGraph label="Umidade" data={humidity} isDataLoad={isDataLoad} />
      <CardGraph label="Temperatura" data={temperature} isDataLoad={isDataLoad} />
     
    </Flex>

  )
}
