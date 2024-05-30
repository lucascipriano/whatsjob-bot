import { Router } from "express";
import { QRCodeController } from "../../api/v1/qrcode/controller";
import { MessageController } from "../../api/v1/message/controller";

const router = Router();

const qrCodeController = new QRCodeController();
const messageController = new MessageController();

router.get("/qrcode", qrCodeController.getQRCodeImageStream);
router.get("/send-text", messageController.sendText);

export { router };
