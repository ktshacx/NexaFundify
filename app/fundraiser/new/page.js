"use client";
import Navbar from "@/components/Navbar";
import { Box, Button, FormControl, FormHelperText, FormLabel, Image, Input, Select, Text, useToast } from "@chakra-ui/react";
import addimage from "@/assets/addimage.png";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { useAccount } from "wagmi";

export default function Profile() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [cause, setCause] = useState("");
    const [amount, setAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const router = useRouter();
    const toast = useToast();
    const { address, isConnecting, isDisconnected } = useAccount()

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setUploadImage(event.target.files[0]);
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    async function create() {
        if(title == "" || cause == "" || amount == "" || Number(amount) <= 0 || description == "") {
            toast({
                title: "Please fill all the fields",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }else if(!uploadImage){
            toast({
                title: "Please upload thumbnail",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }else if(isDisconnected){
            toast({
                title: "Please connect the wallet",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }else{
            const thumbnail = await supabase.storage.from('thumbnail').upload(Math.floor(Math.random() * 9000000000 + 1000000000)+'.png', uploadImage);
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase.from('fundraising').insert({
                title: title,
                cause: cause,
                amount: amount,
                description: description,
                thumbnail: 'https://bpiaskernlcagmajxbqc.supabase.co/storage/v1/object/public/thumbnail/'+thumbnail.data.path,
                status: 'pending',
                fundraiser: user.data.user.email,
                wallet: address,
                deadline: deadline
            })
            if (error) {
                console.log(error)
                toast({
                    title: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }else{
                toast({
                    title: "Fundraising created successfully, wait for admin approval",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                router.push('/dashboard');
            }
        }
    }

    return (
        <Box p={5}>
            <Navbar/>
            <Box width={'100vw'} padding={10}>
                <Text fontSize={'20px'} fontWeight={'700'} color={'#dd6b20'} cursor={'pointer'} onClick={() => router.replace('/dashboard')}>{'<< Go Back'}</Text>
                <Box display={'flex'} padding={10} flexDir={'column'} alignItems={'center'}>
                        <Image src={selectedImage ? selectedImage : addimage.src } borderRadius={'20px'} maxW={'640px'} height={'380px'} onClick={() => document.getElementById('imageUpload').click()}/>
                        <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange}/> 
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Box display={'flex'} gap={10}>
                                <Input type={'text'} placeholder={'fundraising title'} focusBorderColor={'#dd6b20'} value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </Box>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Choose Cause</FormLabel>
                            <Select placeholder={'choose cause'} focusBorderColor={'#dd6b20'} value={cause} onChange={(e) => setCause(e.target.value)}>
                                <option value="health">Health</option>
                                <option value="impact">Impact</option>
                                <option value="startup">Start Up</option>
                                <option value="personal">Personal</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Deadline</FormLabel>
                            <Input type={'date'} placeholder={'amount'} focusBorderColor={'#dd6b20'} value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Raising Amount (in MATIC)</FormLabel>
                            <Input type={'number'} placeholder={'amount'} focusBorderColor={'#dd6b20'} value={amount} onChange={(e) => setAmount(e.target.value)}/>
                        </FormControl>
                        <FormControl mt={'20px'}>
                            <FormLabel>Description</FormLabel>
                            <FormHelperText>Please write proper cause, and how you gonna use the funds.</FormHelperText>
                        <div data-color-mode="light">
                            <MDEditor value={description} onChange={setDescription} style={{marginTop: '20px'}}/>
                        </div>
                        </FormControl>
                        <Button colorScheme={'orange'} mt={10} onClick={create}>Create Fundraiser</Button>
                </Box>
            </Box>
        </Box>
    )
}