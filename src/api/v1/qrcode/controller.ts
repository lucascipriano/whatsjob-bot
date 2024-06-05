import { Request, Response } from "express";
import { whatsappService } from "../../../core/services/whatsapp-service";
import * as QRCode from "qrcode";

const BOT_MESSAGES = {
  qr: `© BOT - QRCode recebido! Vá para ${process.env.SITE_URL}/api/v1/qrcode e aponte a câmera do seu celular!`,
  ready: "© BOT - Dispositivo pronto!",
  authenticated: "© BOT - Autenticado",
  auth_failure: "© BOT - Falha na autenticação",
  disconnected: "© BOT - Cliente desconectado",
  qr_not_found: "QRCode não encontrado!",
};

class QRCodeController {
  private qrCode: string = "";

  constructor() {
    whatsappService.on("qr", (qr) => {
      this.qrCode = qr;
      console.log(BOT_MESSAGES.qr);
    });

    whatsappService.on("ready", () => {
      console.log(BOT_MESSAGES.ready);
    });

    whatsappService.on("authenticated", () => {
      console.log(BOT_MESSAGES.authenticated);
    });

    whatsappService.on("auth_failure", function () {
      console.error(BOT_MESSAGES.auth_failure);
    });

    whatsappService.on("disconnected", (reason) => {
      console.log(BOT_MESSAGES.disconnected, reason);
      whatsappService.initialize();
    });
  }

  public getQRCodeImageStream = async (req: Request, res: Response) => {
    if (!this.qrCode) {
      return res.status(404).json({ msg: BOT_MESSAGES.qr_not_found });
    }

    res.setHeader("Content-Type", "image/png");
    return QRCode.toFileStream(res, this.qrCode);
  };
}

export { QRCodeController };
