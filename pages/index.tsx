// import Head from 'next/head'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Flex, Image, Button, Text } from '@chakra-ui/core'
import Input from '../components/Input'
import axios from 'axios'


import { Chart } from "react-google-charts";
export interface HUMIDITY {
  subscribeAt: string,
  value: string,
}

let countDownTimeout: NodeJS.Timeout;
export default function Home() {
  const isMount = useRef(true);
  const isAwait = useRef(true);

  const [humidity, setHumidity] = useState<HUMIDITY[]>([])

  async function get() {
    isAwait.current = false;
    const { data } = await axios.get('/api/getvalues');
    console.log(data)
    let h = []
    for (let i of data.humidity) {
      h.push([i.subscribeAt, i.value])
    }
    setHumidity(h)
    console.log(h)
    isAwait.current = true;
  };

  useEffect(() => {
    if (isMount.current)
      setInterval(() => {
        console.log("currentAWAIT", isAwait.current)
        if (isAwait.current) {
          get();
        }
      }, 600000)

    return () => {
      isMount.current = false
      clearTimeout(countDownTimeout);
    }
  }, [])

  return (
    <Flex
      as="main"
      marginY="50px"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="100%"
        maxW="400px"
      >

        <Text textAlign="center" fontSize="sm" color="gray.400" marginBottom={2}>
          Em breve!
        </Text>
        <Flex
          backgroundColor="gray.700"
          borderRadius="md"
          flexDir="column"
          alignItems="stretch"
          padding={8}
          marginTop={4}
          width="100%"
          maxW="400px"
        >


          <Chart

            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Hora', 'Umidade'],
              ['', 0]
            ]}
            options={{
              title: 'Umidade',
              hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { width: '50%', height: '70%' },
              // lineWidth: 25
            }}
          />


        </Flex>

      </Flex>
      <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="100%"
        maxW="400px"
      >

        <Text textAlign="center" fontSize="sm" color="gray.400" marginBottom={2}>
          Em breve!
        </Text>

        <Flex
          backgroundColor="gray.700"
          borderRadius="md"
          flexDir="column"
          alignItems="stretch"
          padding={8}
          marginTop={4}
          width="100%"
          maxW="400px"
        >

          <Chart

            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Hora', 'Temperatura'],
              ['2013', 1000],
              ['2014', 1170],
              ['2015', 660],
              ['2016', 1030],
            ]}
            options={{
              title: 'Temperatura',
              hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { width: '50%', height: '70%' },
              // lineWidth: 25
            }}
          />

        </Flex>
      </Flex>

    </Flex>

  )
}
