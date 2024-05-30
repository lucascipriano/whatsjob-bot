"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeController = void 0;
const whatsapp_service_1 = require("../../../core/services/whatsapp-service");
const QRCode = __importStar(require("qrcode"));
const LOCAL_QRCODE_URL = "http://localhost:3000/qrcode";
class QRCodeController {
    qrCode = "";
    constructor() {
        whatsapp_service_1.whatsappService.on("qr", (qr) => {
            this.qrCode = qr;
            console.log(`QRCode: ${LOCAL_QRCODE_URL}`);
        });
        whatsapp_service_1.whatsappService.on("ready", () => {
            console.log("You're connected successfully!");
        });
    }
    getQRCodeImageStream = async (req, res) => {
        if (!this.qrCode) {
            return res.status(404).json({ msg: "Not Found" });
        }
        res.setHeader("Content-Type", "image/png");
        return QRCode.toFileStream(res, this.qrCode);
    };
}
exports.QRCodeController = QRCodeController;
