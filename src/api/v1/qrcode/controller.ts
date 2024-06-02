import { Request, Response } from "express";
import { whatsappService } from "../../../core/services/whatsapp-service";
import * as QRCode from "qrcode";

const LOCAL_QRCODE_URL = "http://localhost:3000/api/v1/qrcode";

class QRCodeController {
  private qrCode: string = "";

  constructor() {
    whatsappService.on("qr", (qr) => {
      this.qrCode = qr;
      console.log(`QRCode: ${LOCAL_QRCODE_URL}`);
    });

    whatsappService.on("ready", () => {
      console.log("You're connected successfully!");
    });
  }

  public getQRCodeImageStream = async (req: Request, res: Response) => {
    if (!this.qrCode) {
      return res.status(404).json({ msg: "Not Found" });
    }

    res.setHeader("Content-Type", "image/png");
    return QRCode.toFileStream(res, this.qrCode);
  };
}

export { QRCodeController };
