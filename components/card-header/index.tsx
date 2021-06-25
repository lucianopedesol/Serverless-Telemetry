import { Flex, Text, Image } from '@chakra-ui/core';

export default function CardHeader() {
    return(
        <Flex
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        padding={8}
        marginTop={4}
        width="100%"
        height="100px"
        >
            <Flex alignItems="flex-end">
                <Image size="20" src="pi.png" />
                <Text marginBottom="10px">Telemetry</Text>
            </Flex>
            <Image width="200px" height="60px" src="logo-faesa-branco.webp" />
        </Flex>
    );
}