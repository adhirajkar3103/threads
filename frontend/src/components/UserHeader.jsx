import {
  Avatar,
  Box,
  Flex,
  VStack,
  Text,
  Link,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import {Link as RouterLink} from 'react-router-dom'
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({user}) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom)
  const [following,setFollowing] = useState(user.followers.includes(currentUser?._id))
  const [updating,setUpdating] = useState(false)
  const showToast = useShowToast()


  const copyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: "Copied to clipboard", status: "success" });
    });
  };

  const handleFollowUnfollow = async () =>{
    if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (updating) return;
    try {
      const res = await fetch(`/api/users/follow/${user?._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      })
      const data = await res.json()
      if(data.error){
        showToast('Error',data.error,'error')
        return;
      }
      if (following) {
				showToast("Success", `Unfollowed ${user?.name}`, "success");
				user.followers.pop(); // simulate removing from followers
			} else {
				showToast("Success", `Followed ${user?.name}`, "success");
				user.followers.push(currentUser?._id); // simulate adding to followers
			}
			setFollowing(!following);
    } catch (error) {
      showToast('Error',error,'error')
    }finally {
			setUpdating(false);
		}
  }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
              fontSize={"xs"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>

        {
          user.profilePic?(
            <Avatar name={user?.name} src={user?.profilePic} size={{
            base:'md',
            md:'xl'
          }} />
          ):(
            <Avatar name={user?.name} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png" size={{
            base:'md',
            md:'xl'
          }} />
          )
        }
          
        </Box>
      </Flex>
      <Text>{user.bio}</Text>


        {
          currentUser?._id===user?._id && (
            <Link as={RouterLink} to="/update">
        <Button size={"sm"}>Update profile</Button>
      </Link>
          )
        }

        {
          currentUser?._id !== user?._id && (
            <Button isLoading={updating} onClick={handleFollowUnfollow} size={"md"}>
              {following?'Unfollow':'Follow'}
            </Button>
          )
        }
      
         
      

      

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com/{user?.username}</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
