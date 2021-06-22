// import Head from 'next/head'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Flex, Image, Button, Text } from '@chakra-ui/core'
import Input from '../components/Input'
import axios from 'axios'


import { Chart } from "react-google-charts";
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
  const [temperature, setTemperature] = useState<any>([])
  const [isDataLoad, setIsDataLoad] = useState(false);

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
    
    setHumidity(h)
    setTemperature(t)
    isAwait.current = true;
    setIsDataLoad(true);
  };

  useEffect(() => {
    if (isMount.current)
      get();
      setInterval(() => {
        if (isAwait.current) {
          get();
        }
      }, 80000)

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
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="80%"
        height="500px"
      >

        <Text textAlign="center" fontSize="sm" color="gray.400" marginBottom={2}>
          Umidade
        </Text>

        {isDataLoad?
          <Chart
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={humidity}
            options={{
              height: 400,
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { height: '80%' },
              legend: 'none',
            }}
          />:
          <></>
        }

      </Flex>
      
      <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="80%"
        height="500px"
      >

        <Text textAlign="center" fontSize="sm" color="gray.400" marginBottom={2}>
          Temperatura
        </Text>

        {isDataLoad?
          <Chart
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={temperature}
            options={{
              height: 400,
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { height: '70%' },
              legend: 'none',
              // lineWidth: 25
            }}
          />:
          <></>
        }
      </Flex>
    </Flex>

  )
}
