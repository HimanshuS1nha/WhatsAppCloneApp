import { z } from "zod";

export const deleteChatsValidator = z.object({
  messages: z.array(
    z.object({
      _id: z.string(),
      message: z.string(),
      sentAt: z.string(),
      sentBy: z.string(),
      sentTo: z.string(),
      isSeen: z.boolean(),
    })
  ),
  id: z.string(),
});
