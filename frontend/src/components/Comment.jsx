import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import Actions from "./Actions";
import { useState } from "react";

const Comment = () => {
    const [liked,setLiked] = useState(false)
  return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src="zuck-avatar.png" size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize='sm' fontWeight='bold'>
							markzuck
						</Text>
					</Flex>
					<Text>Wohh man! great stuff</Text>
                    <Actions liked={liked} setLiked={setLiked} />
                    <Text fontSize={"sm"} color={"gray.light"}>123 likes</Text>
				</Flex>
			</Flex>
			<Divider />
    </>
  )
}

export default Comment