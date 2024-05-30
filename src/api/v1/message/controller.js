"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const whatsapp_service_1 = require("../../../core/services/whatsapp-service");
class MessageController {
    sendText = async (req, res) => {
        await whatsapp_service_1.whatsappService.sendMessage("5547997624220@c.us", "Teste");
        return res.json({ msg: "enviado!" });
    };
}
exports.MessageController = MessageController;
