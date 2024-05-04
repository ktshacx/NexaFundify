"use client";
import Navbar from "@/components/Navbar";
import { Box, Button, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { fundraiserFactoryAbi } from "@/utils/contractHelper";
import { config } from "@/config";
import { writeContract } from "@wagmi/core";

export default function Admin() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [fundraisers, setFundraisers] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [reason, setReason] = useState("");
    const toast = useToast();

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
            const f = await supabase.from('fundraising').select();
            console.log(f)
            setFundraisers(f.data);
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
                                    <Text fontWeight={'700'}>Deadline:</Text>
                                    <Text fontWeight={'400'}>{fundraiser.deadline}</Text>
                                </Box>
                                <Box mt={'10px'}>
                                    <Text fontWeight={'700'}>Status:</Text>
                                    <Text fontWeight={'400'}>{fundraiser.status}</Text>
                                </Box>
                                {fundraiser.status == 'pending' && <Button mt={'10px'} width={'100%'} onClick={async () => {

                                }}>Approve</Button>}
                                <Button mt={'10px'} width={'100%'} colorScheme={'red'} onClick={onOpen}>Reject / Delete</Button>
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay/>
                                    <ModalContent>
                                        <ModalHeader>Reason for rejection ?</ModalHeader>
                                        <ModalCloseButton/>
                                        <ModalBody>
                                            <FormControl>
                                                <Input type="text" placeholder="reason" value={reason} onChange={(e) => setReason(e.target.value)}/>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme="red" mr={3} onClick={async () => {
                                                const { data, error } = await supabase.from('fundraising').update({
                                                    status: 'rejected, '+reason,
                                                }).eq('id', fundraiser.id);
                                                if(!error){
                                                toast({
                                                     title: 'Fundraiser Rejected',
                                                     description: 'The fundraiser has been rejected',
                                                     status:'success',
                                                     duration: 5000,
                                                     isClosable: true,
                                                })
                                                }else{
                                                     console.log(error)
                                                }
                                                onClose();
                                            }}>Reject</Button>
                                            <Button mr={3} onClick={onClose}>Close</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Box>
                        </Box>
                    )) : null}
                </Box>
            </Box>
        </Box>
    )
}