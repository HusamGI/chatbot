//#region Implementation details

// In a real scenario this conversation map should be saved in the database
const conversations = new Map<string, string>();

//#endregion

//#region Public interface

export const ConversationRepository = {
  getLastResponseId: (conversationId: string): string | null =>
    conversations.get(conversationId) ?? null,

  setLastResponseId: (conversationId: string, responseId: string) =>
    conversations.set(conversationId, responseId),
};

//#endregion
