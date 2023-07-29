import { updateGroupNameUrl } from "../../urls";

async function updateGroupName(
  groupName,
  setGroupName,
  selectedChat,
  setSelectedChat,
  Toast,
  setIsLoading
) {
  try {
    setIsLoading(true);
    const updatedResult = await fetch(updateGroupNameUrl, {
      method: "PUT",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        groupChatId: selectedChat._id,
        name: groupName,
      }),
    });
    const updatedNameJson = await updatedResult.json();
    setIsLoading(false);
    if (updatedResult.status === 200) {
      Toast({
        status: "success",
        Title: "Success",
        description: "Group name Updated successfully",
        duration: 3000,
      });
      console.log("updatedNameJson", updatedNameJson, updatedNameJson.message);
      setSelectedChat(updatedNameJson.message);
    } else if (updatedResult.status !== 500) {
      Toast({
        status: "error",
        Title: "err",
        description: updatedNameJson.message,
        duration: 3000,
      });
    } else {
      Toast({
        status: "error",
        Title: "err",
        description: "Internal server error",
        duration: 3000,
      });
    }
  } catch (err) {
    console.log(err);
    Toast({
      status: "error",
      Title: "err",
      description: "Internal server error",
      duration: 3000,
    });
  }
}

export default updateGroupName;
