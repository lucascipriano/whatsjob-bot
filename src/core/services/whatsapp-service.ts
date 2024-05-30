import { Client, LocalAuth } from "whatsapp-web.js";

const whatsappService = new Client({
  authStrategy: new LocalAuth({ clientId: "bot" }),
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

export { whatsappService };
