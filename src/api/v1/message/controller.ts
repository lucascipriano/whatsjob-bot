import { Request, Response } from "express";
import { whatsappService } from "../../../core/services/whatsapp-service";

class MessageController {
  public sendText = async (req: Request, res: Response) => {
    await whatsappService.sendMessage("5547997624220@c.us", "Teste");
    return res.json({ msg: "enviado!" });
  };
}

export { MessageController };
