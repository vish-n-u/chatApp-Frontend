export const getChatsurl =
  process.env.REACT_APP_getChatsurl ||
  "http://localhost:5000/chatApp/api/v1/chats";
export const getUsersChatsurl =
  process.env.REACT_APP_getUsersChatsurl ||
  "http://localhost:5000/chatApp/api/v1/users";
export const searchUserurl =
  process.env.REACT_APP_searchUserurl ||
  "http://localhost:5000/chatApp/api/v1/users?search=";
export const endpoint =
  process.env.REACT_APP_endpoint || "http://localhost:5000";
export const fetchChatMessages =
  process.env.REACT_APP_fetchChatMessages ||
  "http://localhost:5000/chatApp/api/v1/messages/";
export const addUserUrl =
  process.env.REACT_APP_addUserUrl ||
  "http://localhost:5000/chatApp/api/v1/groupchats/adduser";
export const removeUserUrl =
  process.env.REACT_APP_removeUserUrl ||
  "http://localhost:5000/chatApp/api/v1/groupchats/removeuser";

export const updateGroupNameUrl =
  process.env.REACT_APP_updateGroupNameUrl ||
  "http://localhost:5000/chatApp/api/v1/groupchats";

export const loginUrl =
  process.env.REACT_APP_loginUrl ||
  "http://localhost:5000/chatApp/api/v1/users/login";
export const registerUrl =
  process.env.REACT_APP_registerUrl ||
  "http://localhost:5000/chatApp/api/v1/users/register";
export const postMessagesUrl =
  process.env.REACT_APP_postMessagesUrl ||
  "http://localhost:5000/chatApp/api/v1/messages";
export const groupChatsUrl =
  process.env.REACT_APP_groupChatsUrl ||
  "http://localhost:5000/chatApp/api/v1/groupchats";
