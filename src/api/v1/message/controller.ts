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
    const number = req.body.number;
    const numberDDI = number.substr(0, 2);
    const numberDDD = number.substr(2, 2);
    const numberUser = number.substr(-8, 8);
    const message = req.body.message;

    if (numberDDI !== "55") {
      const completeNumber = number + "@c.us";
      whatsappService
        .sendMessage(completeNumber, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT Mensagem não enviada",
            response: err.text,
          });
        });
    } else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
      const completeNumber = "55" + numberDDD + "9" + numberUser + "@c.us";
      whatsappService
        .sendMessage(completeNumber, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT Mensagem não enviada",
            response: err.text,
          });
        });
    } else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
      const completeNumber = "55" + numberDDD + numberUser + "@c.us";
      whatsappService
        .sendMessage(completeNumber, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT Mensagem não enviada",
            response: err.text,
          });
        });
    }
  };
}

export { MessageController };
