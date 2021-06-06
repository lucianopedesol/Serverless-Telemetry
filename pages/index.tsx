// import Head from 'next/head'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Flex, Image, Button, Text } from '@chakra-ui/core'
import Input from '../components/Input'
import axios from 'axios'


let countDownTimeout: NodeJS.Timeout;

export default function Home() {

  const isMount = useRef(true);
  const isAwait = useRef(true);

  async function get() {
    isAwait.current = false;
    const { data } = await axios.get('/api/getvalues');
    isAwait.current = true;
  };

  useEffect(() => {
    if (isMount.current)
      setInterval(() => {
        console.log("currentAWAIT", isAwait.current)
        if (isAwait.current) {
          get();
        }
      }, 60000)

    return () => {
      isMount.current = false
      clearTimeout(countDownTimeout);
    }
  }, [])

  return (
    <Flex
      as="main"
      height="100vh"
      justifyContent="center"
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


      </Flex>

    </Flex>
  )
}
