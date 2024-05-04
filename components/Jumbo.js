"use client";
import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Jumbo() {
    const router = useRouter();

    return (
        <Box padding={20} marginY={10} background={'#fcf2e1'} borderRadius={20}>
            <Box fontSize={20} fontWeight={'300'} maxWidth={'500'} display={'flex'} gap={2}>
                <Text>Health</Text>
                <Text fontWeight={'700'} color={'#dd6b20'}>|</Text>
                <Text>Impact</Text>
                <Text fontWeight={'700'} color={'#dd6b20'}>|</Text>
                <Text>Start-Up</Text>
            </Box>
            <Text fontSize={45} fontWeight={'700'} maxWidth={'500'}>Crowdfunding Made Easy !!</Text>
            <Text fontSize={18} fontWeight={'300'} maxWidth={'600'} marginY={'20px'}>Fundraisers connect directly with backers, ensuring transparency, lower fees, and community-driven decision-making. Fund your passion, support innovation, and join the decentralized future of funding.</Text>
            <Box display={'flex'} gap={'20px'} marginTop={'30px'}>
                <Button colorScheme={'orange'} onClick={() => router.replace('/fundraiser/new')}>Start your Fundraiser</Button>
                <Button colorScheme={'orange'}>Donate Now</Button>
            </Box>
        </Box>
    )
}