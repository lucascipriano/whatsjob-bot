"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const whatsappService = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: "bot" }),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
        ],
    },
});
exports.whatsappService = whatsappService;
