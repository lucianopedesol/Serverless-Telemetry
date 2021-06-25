import { Flex, Text } from '@chakra-ui/core';
export default function CardInformation({type, label, value, sensorValue = null}) {

    function getRain(sensorValueParm): string {
        if(!sensorValueParm){
            return '-';
        }

        if ( sensorValueParm < 300) {       // Chuva intensa
            return 'Chuva intensa';
          }
          // Se a leitura analógica for menor que 500 e maior que 300 
          if (sensorValueParm <= 500 && sensorValueParm >= 300) { // Chuva moderada
            return 'Chuva moderada';
          }
          // Se a leitura analógica for maior que 500 
          if ( sensorValueParm > 500) {        // Sem previsão de Chuva 
            return 'Sem Chuva';
          }
    }

    return (
    <>
        <Flex
            backgroundColor="purple.500"
            borderRadius="md"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            padding={8}
            marginTop={4}
            width={{base: "100%", lg: "30%"}}
            height="200"
        >
            {type=="C"?
                <>
                    <Text style={{fontSize: 30}}>{label}</Text>
                    <Text style={{fontSize: 20}}>{value?.weatherDescription?.toUpperCase()}</Text>
                    <Text style={{fontSize: 18}}>{getRain(sensorValue)}</Text>
                    <Text style={{fontSize: 20}}>{'Vento: ' + value?.windSpeed + ' km/h'}</Text>
                </>:
                <>
                    <Text style={{fontSize: 30}}>{label}</Text>
                    <Text style={{fontSize: 40}}>{value + (type=="T"?"°C":"%")}</Text>
                </>
            }
        </Flex>
    </>
    );
}