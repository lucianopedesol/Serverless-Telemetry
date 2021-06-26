import { Flex, Text } from '@chakra-ui/core';

import { Chart } from "react-google-charts";

import { Spinner } from "@chakra-ui/core";

export default function CardGraph({label, data, isDataLoad = false}) {
    return (
        <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="100%"
        height="500px"
      >

        <Text textAlign="center" fontSize="lg" color="gray.400" marginBottom={2}>
          {label}
        </Text>

        {isDataLoad?
          <Chart
            chartType="AreaChart"
            data={data}
            options={{
              curveType: 'function',
              height: 400,
              vAxis: { 
                minValue: 0,
                gridlines: {
                  minSpacing: 10
                },
                minorGridlines: {
                  minSpacing: 10
                },
                textStyle: { 
                  color: '#fff'
                },
                format: 'decimal'
              },
              hAxis: { 
                textStyle: {
                  color: '#fff'
                },
                slantedText: true
              },
              // For the legend to fit, we make the chart area smaller
              chartArea: { left:40,top:10,width:'95%',height:'85%' },
              legend: 'none',
              backgroundColor: '#202024'
            }}
          />:
          <Flex            
            alignItems="center"
            justifyContent="center"
            >
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                />
            </Flex>
        }

      </Flex>
    );
}