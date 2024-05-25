// ----------------------------------------------------------------------

import { url } from "inspector";
import { IUser } from "src/types/user";
import axiosInstance, { endpoints } from "src/utils/axios";
import { mutate } from "swr";

export function useGetUserRoles() {
  return {
    roles: ["OWNER", "PRODUCER", "MANUFACTURER", "WHOLESELLER", "RETAILER"],
    isLoading: false,
    isError: false,
  };
}

// ----------------------------------------------------------------------

export async function updateUser(user: Partial<IUser>, id: string) {
  const URL = endpoints.user.details(`${id}`);
  console.log("URL", URL);

  /**
   * Work on server
   */
  const data = { ...user };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentUser: any) => {
      const updatedUsers = currentUser.user.map((p: IUser) => {
        return p.id === user.id ? { ...p, ...user } : p;
      });

      return { ...currentUser, users: updatedUsers };
    },
    false
  );
}

// export async function clickConversation(conversationId: string) {
//   const URL = endpoints.chat;

//   /**
//    * Work on server
//    */
//   // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

//   /**
//    * Work in local
//    */
//   mutate(
//     [
//       URL,
//       {
//         params: { endpoint: 'conversations' },
//       },
//     ],
//     (currentData: any) => {
//       const conversations: IChatConversations = currentData.conversations.map(
//         (conversation: IChatConversation) =>
//           conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
//       );

//       return {
//         ...currentData,
//         conversations,
//       };
//     },
//     false
//   );
// }

// ----------------------------------------------------------------------

export async function verifyEthUserAddr(
  data: {
    ethAddr: `0x${string}` | undefined;
    transactionHash: string;
  },
  user: IUser
) {
  console.log("verify data: ", data);
  const URL = endpoints.user.details(`${user?.id}`);

  /**
   * Work on server
   */
  // const data = { ...user };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentUser: any) => {
      const updatedUsers = currentUser.user.map((p: IUser) => {
        return p.id === user.id ? { ...p, ...user } : p;
      });

      return { ...currentUser, users: updatedUsers };
    },
    false
  );
}
