"use client"
import { supabase } from "@/utils/supabase";
import { Box, Button, Image, Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import profile from "@/assets/profile.png";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const { open, close } = useWeb3Modal()
    const { address, isConnecting, isDisconnected } = useAccount()

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
        fetchUser();
    }, [])

    return (
        <Box p={0} display={'flex'} justifyContent={'space-between'}>
        <Text fontSize={25} fontWeight={700} onClick={() => router.push('/')} cursor={'pointer'}>NexaFundify</Text>
        
        {user ? <Box display={'flex'} gap={5} alignItems={'center'}>
            <Popover >
                <PopoverTrigger>
                    {user.profile_image ? <Image src={user.profile_image} w={'40px'} height={'40px'} cursor={'pointer'} borderRadius={'1000px'}/> : <Image src={profile.src} w={'40px'} height={'40px'} cursor={'pointer'}/>}
                </PopoverTrigger>
                <Portal>
                    <PopoverContent width={'200px'}>
                      <PopoverBody>
                        <Text cursor={'pointer'} onClick={() => router.replace('/dashboard/profile')}>Profile</Text>
                        <Text mt={2} cursor={'pointer'} onClick={() => router.replace('/dashboard')}>Dashboard</Text>
                      </PopoverBody>
                      <PopoverFooter cursor={'pointer'} onClick={async () => {await supabase.auth.signOut(); router.replace('/')}}>LogOut</PopoverFooter>
                    </PopoverContent>
                </Portal>
            </Popover>
            <Box>
                <Text fontWeight={700}>{user.email}</Text>
                {user.wallet ? <Text color={'#dd6b20'}>{user.wallet}</Text> : (isDisconnected ? <Text color={'#dd6b20'} onClick={open} cursor={'pointer'}>Connect Wallet</Text> : <Text color={'#dd6b20'} onClick={() => open({view: "Account"})} cursor={'pointer'}>{address}</Text>)}
            </Box>        </Box> : 
        <Box display={'flex'} gap={5}>
            <Button colorScheme={'orange'} onClick={() => router.replace('/signup')}>Sign Up</Button>
            <Button onClick={() => router.replace('/login')}>Login</Button>
        </Box>}
      </Box>
    )
}