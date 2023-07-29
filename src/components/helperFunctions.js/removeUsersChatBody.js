// import { useEventListenerMap } from "@chakra-ui/react";
import { addUserUrl, removeUserUrl } from "../../urls";
async function updateGroupMembers(
  ourUser,
  userToBeUpdated,
  selectedChat,
  setSelectedChat,
  Toast,
  setIsLoading,
  setIsChatSelected,
  addOrRemove
) {
  try {
    console.log("---usersToBeUpdated", userToBeUpdated);
    setIsLoading(true);

    console.log(userToBeUpdated, "---usersToBeUpdated");
    let url;
    let body;
    if (addOrRemove == "add") {
      url = addUserUrl;
      body = { updateUser: userToBeUpdated, groupChatId: selectedChat._id };
    } else {
      url = removeUserUrl;
      body = {
        groupChatId: selectedChat._id,
        updateUser: userToBeUpdated,
      };
    }
    const data = await fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    });
    const dataJson = await data.json();
    console.log("dataJson----", data, dataJson);
    setIsLoading(false);

    if (data.status == 200) {
      Toast({
        status: "success",
        title: "Success",
        description: "Group chat successfully updated",
        duration: 3000,
      });
      console.log("users to be removed from grp chat", userToBeUpdated);
      if (addOrRemove == "remove" && ourUser._id === userToBeUpdated) {
        console.log("Selected chat");
        setSelectedChat({});
        setIsChatSelected(false);
      } else setSelectedChat(dataJson.message);
      // setUsersToBeUpdated([]);
      // setSelectedChat({});
      return;
    }
    if (dataJson.status !== 500) {
      Toast({
        status: "warning",
        title: "Warning",
        description: dataJson.messaage,
        duration: 3000,
      });
    } else {
      Toast({
        status: "error",
        title: "Error",
        description: "Internal server error",
        duration: 3000,
      });
    }
    setIsLoading(false);
  } catch (err) {
    Toast({
      status: "error",
      title: "Error",
      description: "Internal server error",
      duration: 3000,
    });
    setIsLoading(false);
  }
}

export default updateGroupMembers;
