"use client";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase";
import { Box, Button, FormControl, FormLabel, Input, Link, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toast = useToast();
    const router = useRouter();

    async function signUp() {
        if(firstname === '' || lastname === '' || email === '' || password === ''){
            toast({
                title: 'Please fill all the fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }else if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password) == false){
            toast({
                title: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }else if(password!== confirmPassword){
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }else{
            const { data, error } = await supabase.auth.signUp({
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
            if(data.user){
                toast({
                    title: 'Account created successfully',
                    status:'success',
                    duration: 5000,
                    isClosable: true,
                })
                const tabled = await supabase.from('users').insert({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    uid: data.user.id
                });
                if(tabled.error){
                    toast({
                        title: 'Some error occured while signing up',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                    console.log(tabled.error)
                }else{
                    router.push('/dashboard')
                }
            }
        }
    }

    return (
        <Box minH={'100vh'} minW={'100vw'} p={5}>
            <Navbar/>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Box marginTop={'100px'} width={'450px'}>
                    <Text fontSize={'30px'} fontWeight={'700'}>Sign Up</Text>
                    <FormControl mt={'20px'}>
                        <FormLabel>Name</FormLabel>
                        <Box display={'flex'} gap={'10px'}>
                            <Input type="text" placeholder="firstname" focusBorderColor='#dd6b20' value={firstname} onChange={(event) => setFirstname(event.target.value)}/>
                            <Input type="text" placeholder="lastname" focusBorderColor='#dd6b20' value={lastname} onChange={(event) => setLastname(event.target.value)}/>
                        </Box>
                    </FormControl>
                    <FormControl mt={'20px'}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="email" focusBorderColor='#dd6b20' value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </FormControl>
                    <FormControl mt={'20px'}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="password" focusBorderColor='#dd6b20' value={password} onChange={(event) => setPassword(event.target.value)}/>
                    </FormControl>
                    <FormControl mt={'20px'}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input type="password" placeholder="confirm password" focusBorderColor='#dd6b20' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
                    </FormControl>
                    <Button mt={'20px'} colorScheme={'orange'} width={'100%'} onClick={signUp}>Sign Up</Button>
                    <Box display={'flex'} fontSize={'18px'} justifyContent={'center'} mt={'10px'} gap={'10px'}><Text>Already have a account ? </Text><Link color={'#dd6b20'} href="/login">Login</Link></Box>
                </Box>
            </Box>
        </Box>
    )
}