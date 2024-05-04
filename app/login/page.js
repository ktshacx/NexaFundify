"use client";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase";
import { Box, Button, FormControl, FormLabel, Input, Link, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toast = useToast();
    const router = useRouter();

    async function login() {
        if(email === '' || password === ''){
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }else{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if(error){
                toast({
                    title: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
            if(data){
                toast({
                    title: 'Login successful !!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                router.push('/');
            }
        }
    }

    return (
        <Box minH={'100vh'} minW={'100vw'} p={5}>
            <Navbar/>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Box marginTop={'100px'} width={'450px'}>
                    <Text fontSize={'30px'} fontWeight={'700'}>Login</Text>
                    <FormControl mt={'20px'}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="email" focusBorderColor='#dd6b20' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </FormControl>
                    <FormControl mt={'20px'}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="password" focusBorderColor='#dd6b20' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </FormControl>
                    <Button mt={'20px'} colorScheme={'orange'} onClick={login}>Login</Button>
                    <Box display={'flex'} fontSize={'18px'} justifyContent={'center'} mt={'10px'} gap={'10px'}><Text>Don&apos;t have a account ? </Text><Link color={'#dd6b20'} href="/signup">Sign Up</Link></Box>
                </Box>
            </Box>
        </Box>
    )
}