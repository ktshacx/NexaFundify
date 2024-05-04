import Jumbo from "@/components/Jumbo";
import Navbar from "@/components/Navbar";
import { Box, Button, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box p={5}>
      <Navbar/>
      <Jumbo/>
    </Box>
  );
}
