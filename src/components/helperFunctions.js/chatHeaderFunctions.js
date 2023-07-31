import { searchUserurl, getChatsurl } from "../../urls";

export async function handleClickFunction(
  val,
  Toast,
  setIsLoading,
  setSelectedChat,
  setIsChatSelected,
  chats,
  setOtherUsers,
  setChats
) {
  setIsLoading(true);
 
  try {
    for (let x = 0; x < chats.length; x++) {
      for (let y = 0; y < chats[x].users.length; y++) {
        if (!chats[x].isGroupChat) {
          if (chats[x].users[y]._id == val._id) {
            setIsLoading(false);
            setOtherUsers([]);
            return;
          }
        }
      }
    }
    const createNewChat = await fetch(getChatsurl, {
      method: "POST",
      body: JSON.stringify({
        userId: val._id,
      }),
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const createNewChatJson = await createNewChat.json();
    console.log("createNewChat", createNewChat, createNewChatJson);
    setIsLoading(false);
    setOtherUsers([]);
    if (createNewChat.status == 500) {
      Toast({
        status: "error",
        duration: 3000,
        title: "error",
        isClosable: true,
        description: "Internal server error",
        position: "bottom",
      });
      return;
    }
    console.log("createNEwChatJSon", createNewChatJson);
    setSelectedChat(createNewChatJson.fullChat);
    setIsChatSelected(true);
  } catch (err) {
    console.log(err);
    Toast({
      status: "error",
      duration: 3000,
      title: "error",
      isClosable: true,
      description: "Internal server error",
      position: "bottom",
    });
  }
}
export async function getSearchedUsers(
  searchUsers,
  setOtherUsers,
  setIsLoading,
  Toast
) {
  try {
    const ourUser = JSON.parse(localStorage.getItem("user"));
    setIsLoading(true);
    const response = await fetch(`${searchUserurl}${searchUsers}`, {
      headers: {
        "content-type": "application/json",
        authorization: localStorage.token,
      },
    });
    const responseJson = await response.json();
    console.log(responseJson, "search results from header");
    let newArrData = [];
    responseJson.map((val) => {
      if (val._id !== ourUser._id) newArrData.push(val);
    });

    setOtherUsers(responseJson);
    setIsLoading(false);
  } catch (err) {
    console.log(err);
    setIsLoading(false);
    Toast({
      status: "error",
      duration: 3000,
      title: "Error",
      isClosable: true,
      description: "Failed to load search results",
      position: "bottom-left",
    });
    return;
  }
}
