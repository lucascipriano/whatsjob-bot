import { Request, Response } from "express";
import { whatsappService } from "../../../core/services/whatsapp-service";
import * as QRCode from "qrcode";
import { supabaseService } from "../../../core/services/supabase-service";
import { CronJob } from "cron";
import { delay } from "../../../core/utils/delay";

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
      this.initializeCronJob();
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

  private async sendBroadcastMessage() {
    const { data, error } = await supabaseService.from("numeros").select("numero");

    if (error) {
      console.error('Erro ao buscar números do banco de dados:', error);
      return;
    }

    const { data: vagasData, error: vagasError } = await supabaseService.from("vagas").select("titulo, link, empresa, senioridade, modalidade");

    if (vagasError) {
      console.error('Erro ao buscar vagas do banco de dados:', vagasError);
      return;
    }

    if (!vagasData || vagasData.length === 0) {
      console.log('Nenhuma vaga disponível no momento.');
      return;
    }

    let message = `Seguem as vagas!`;

    vagasData.forEach((vaga: any) => {
      message += 
        `\r\n\r\n` +
        `- 🏢 Empresa: ${vaga.empresa}\r\n` +
        `- 🎓 Senioridade: ${vaga.senioridade}\r\n` +
        `- 💼 Vaga: ${vaga.titulo}\r\n` +
        `- 🚩 Modalidade: ${vaga.modalidade}\r\n` +
        `- ❓ Link: ${vaga.link}`;
    });

    for (const entry of data) {
      const number = entry.numero;
      try {
        await whatsappService.sendMessage(`${number}@c.us`, message);
        console.log(`Mensagem enviada para o número: ${number}`);
      } catch (sendError) {
        console.error(`Erro ao enviar mensagem para o número ${number}:`, sendError);
      }
    }
  }
  
  // private initializeCronJob() {
  //   const job = new CronJob(
  //     '*/2 * * * *',
  //     async () => {
  //       await delay(4000);
  //       await this.sendBroadcastMessage();
  //     },
  //     null,
  //     true,
  //     'America/Los_Angeles'
  //   );

  //   job.start();
  // }

  private initializeCronJob() {
    const job = new CronJob(
      '0 9 */15 * *',
      () => this.sendBroadcastMessage(),
      null,
      true,
      'America/Los_Angeles'
    );

    job.start();
  }
}

export { QRCodeController };
