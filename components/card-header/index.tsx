import { Flex, Text, Image } from '@chakra-ui/core';

export default function CardHeader() {
    return(
        <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir={{base:'column', md: 'row'}}
        alignItems="center"
        justifyContent="space-between"
        padding={8}
        marginTop={4}
        width="100%"
        >
            <Flex alignItems="flex-end">
                <Image size="20" src="pi.png" />
                <Text marginBottom="10px">Telemetry</Text>
            </Flex>
            
            <Image marginTop={{base:4, md: 0}} width="200px" height="60px" src="logo-faesa-branco.webp" />
        </Flex>
    );
}