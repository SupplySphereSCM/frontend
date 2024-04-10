// ----------------------------------------------------------------------

export function useGetUserRoles() {
  return {
    roles: ["OWNER", "PRODUCER", "MANUFACTURER", "WHOLESELLER", "RETAILER"],
    isLoading: false,
    isError: false,
  };
}

// ----------------------------------------------------------------------

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
