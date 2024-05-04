"use client";
import Navbar from "@/components/Navbar";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [fundraisers, setFundraisers] = useState();

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error);
            } else {
                const user = await supabase.from('users').select().eq('uid', data.user.id).single();
                setUser(user.data);
            }
        }
        const fetchFundraisers = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error);
            } else {
                const f = await supabase.from('fundraising').select().eq('fundraiser', data.user.email);
                console.log(f)
                setFundraisers(f.data);
            }
        }
        fetchUser();
        fetchFundraisers();
    }, [])

    return (
        <Box p={5}>
            <Navbar/>
            <Box width={'100vw'} display={'flex'} mt={10}>
                <Box width={'300px'} display={'flex'} flexDir={'column'} gap={'10px'}>
                    <Text p={'15px'} fontWeight={'600'} borderRadius={'10px'} color={'#fff'} background={'#dd6b20'} cursor={'pointer'}>My Fundraisers</Text>
                    <Text p={'15px'} fontWeight={'600'} borderRadius={'10px'} _hover={{color: '#fff', background: '#dd6b20'}} cursor={'pointer'} transition={'0.5s ease'}>My Donations</Text>
                    <Text p={'15px'} fontWeight={'600'} borderRadius={'10px'} _hover={{color: '#fff', background: '#dd6b20'}} cursor={'pointer'} transition={'0.5s ease'} onClick={() => router.push('/fundraiser/new')}>Create New Fundraiser</Text>
                </Box>
                <Box paddingLeft={'50px'} display={'flex'} flexWrap={'wrap'} gap={'20px'}>
                    {fundraisers ? fundraisers.map(fundraiser => (
                        <Box borderRadius={'15px'} boxShadow={'0px 4px 8px rgba(0, 0, 0, 0.2)'} width={'350px'} padding={'20px'} key={fundraiser.id}>
                            <Image src={fundraiser.thumbnail} height={'200px'} width={'356px'} borderRadius={'10px'}/>
                            <Box padding={'5px'}>
                                <Text fontSize={'22px'} fontWeight={'700'} textTransform={'uppercase'}>{fundraiser.title}</Text>
                                <Box mt={'10px'}>
                                    <Text fontWeight={'700'}>Raising Amount:</Text>
                                    <Text fontWeight={'400'}>{fundraiser.amount} MATIC</Text>
                                </Box>
                                <Box mt={'10px'}>
                                    <Text fontWeight={'700'}>Status:</Text>
                                    <Text fontWeight={'400'}>{fundraiser.status}</Text>
                                </Box>
                                {!fundraiser.status.includes('rejected') && <Box>
                                <Button mt={'10px'} width={'100%'}>Edit Details</Button>
                                <Button mt={'10px'} width={'100%'} background={'#fcf2e1'}>Updates</Button>
                                    </Box>}
                                
                            </Box>
                        </Box>
                    )) : null}
                </Box>
            </Box>
        </Box>
    )
}