import express from "express";
import { router } from "./core/routes/routes";
import { whatsappService } from "./core/services/whatsapp-service";

function bootstrap() {
  const port = process.env.PORT || 3000;
  const server = express().use(express.json()).use("/", router);

  whatsappService.initialize();

  server.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap();
