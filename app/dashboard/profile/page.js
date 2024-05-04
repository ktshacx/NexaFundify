"use client";
import Navbar from "@/components/Navbar";
import countries from "@/utils/countryList";
import { currencyList } from "@/utils/currencyHelper";
import { Box, Button, FormControl, FormLabel, Image, Input, Select, Text, useToast } from "@chakra-ui/react";
import addimage from "@/assets/addimage.png";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setUploadImage(event.target.files[0]);
          setSelectedImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const toast = useToast();
    const router = useRouter();

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

    async function updateProfile() {
        if(user.firstname == "" || user.lastname == "" || !user.dob) {
            toast({
                title: 'Please fill in all fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }else{
            const profile_pic = await supabase.storage.from('profile').upload(user.uid+Math.floor(Math.random() * 9000000000 + 1000000000)+'.png', uploadImage);
            console.log(profile_pic);
            const { data, error } = await supabase.from('users').update({
                profile_image: 'https://bpiaskernlcagmajxbqc.supabase.co/storage/v1/object/public/profile/'+profile_pic.data.path,
                firstname: user.firstname,
                lastname: user.lastname,
                dob: user.dob,
                country: user.country,
                currency: user.currency,
                address: user.address
            }).eq('uid', user.uid).single();
            if (error) {
                toast({
                    title: 'Some Error Occured',
                    status:'success',
                    duration: 5000,
                    isClosable: true,
                })
                console.log(error);
            } else {
                toast({
                    title: 'Profile Updated',
                    status:'success',
                    duration: 5000,
                    isClosable: true,
                })
                router.refresh();
            }
        }
    }

    return (
        <Box p={5}>
            <Navbar/>
            <Box width={'100vw'} padding={10}>
                <Text fontSize={'20px'} fontWeight={'700'} color={'#dd6b20'} cursor={'pointer'} onClick={() => router.push('/dashboard')}>{'<< Go Back'}</Text>
                <Box display={'flex'} padding={10} justifyContent={'center'}>
                    <Box>
                        <Image src={selectedImage ? selectedImage : (user?.profile_image ? user.profile_image : addimage.src)} w={'200px'} height={'200px'} onClick={() => document.getElementById('imageUpload').click()}/>
                        <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange}/> 
                    </Box>
                    <Box ml={20}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Box display={'flex'} gap={10}>
                                <Input type={'text'} placeholder={'firstname'} focusBorderColor={'#dd6b20'} value={user?.firstname} onChange={(e) => {user.firstname = e.target.value}}/>
                                <Input type={'text'} placeholder={'lastname'} focusBorderColor={'#dd6b20'} value={user?.lastname}  onChange={(e) => {user.lastname = e.target.value}}/>
                            </Box>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Email</FormLabel>
                            <Input type={'email'} placeholder={'email'} focusBorderColor={'#dd6b20'} disabled={true} value={user?.email} onChange={(e) => {user.email = e.target.value}}/>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Date of Birth</FormLabel>
                            <Input type={'date'} placeholder={'address'} focusBorderColor={'#dd6b20'} value={user?.dob} onChange={(e) => {user.dob = e.target.value}}/>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Address</FormLabel>
                            <Input type={'text'} placeholder={'address'} focusBorderColor={'#dd6b20'} value={user?.address} onChange={(e) => {user.address = e.target.value}}/>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Country</FormLabel>
                            <Select value={user?.country} onChange={(e) => {user.country = e.target.value}}>
                                {countries.map((country) =>
                                    <option key={country.text}>{country.text}</option>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Currency</FormLabel>
                            <Select value={user?.currency} onChange={(e) => {user.currency = e.target.value}}>
                                {currencyList.map((currency) =>
                                    <option key={currency}>{currency}</option>
                                )}
                            </Select>
                        </FormControl>
                        <Button colorScheme={'orange'} mt={10} onClick={updateProfile}>Update Profile</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}