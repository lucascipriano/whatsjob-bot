import { Request, Response } from "express";
import { whatsappService } from "../../../core/services/whatsapp-service";
import { Message } from "whatsapp-web.js";
import { handleMessage } from "../../../core/handlers/messageHandler";

class MessageController {
  constructor() {
    whatsappService.on("message", async (msg: Message) => {
      if (this.shouldIgnoreMessage(msg)) return;

      // @ts-ignore
      const contactName = msg._data.notifyName;
      const contact = await msg.getContact();

      await handleMessage(msg, contactName, contact);
    });
  }

  private shouldIgnoreMessage(msg: Message): boolean {
    return (
      msg.type.toLowerCase() === "e2e_notification" ||
      msg.body.trim() === "" ||
      msg.from.includes("@g.us")
    );
  }

  public sendText = async (req: Request, res: Response) => {
    await whatsappService.sendMessage("5547997624220@c.us", "Teste");
    return res.json({ msg: "enviado!" });
  };
}

export { MessageController };
