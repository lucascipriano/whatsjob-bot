import { Message } from "whatsapp-web.js";
import { delay } from "../utils/delay";
import { supabaseService } from "../services/supabase-service";

interface CommandHandlers {
  [key: string]: (contactName: string, contact: any) => Promise<string> | string;
}

const COMMANDS: CommandHandlers = {
  "Olá, gostaria de me cadastrar na lista para receber as vagas!": handleRegistration,
  "1": () => "ola 1",
  "2": () => "ola 2",
  "3": () => "ola 3",
  "4": () => "ola 4",
  "5": () => "ola 5",
  "6": () => "ola 6",
  "7": () => "ola 7",
  "8": () => "ola 8",
};

export async function handleMessage(msg: Message, contactName: string, contact: any) {
  if (msg.body in COMMANDS) {
    const commandHandler = COMMANDS[msg.body];
    const reply =
      typeof commandHandler === "function"
        ? await commandHandler(contactName, contact)
        : commandHandler;
    msg.reply(reply);
  } else {
    await handleDefaultMessage(msg, contactName);
  }
}

async function handleRegistration(contactName: string, contact: any) {
  await supabaseService.from("numeros").insert({ numero: contact.number });
  return `Olá *${contactName}*, tudo bem? Inscrevi você na nossa lista para receber as vagas! Se quiser se desinscrever é só digitar *!cancelar_inscricao*`;
}

async function handleDefaultMessage(msg: Message, contactName: string) {
  msg.reply(`Olá *${contactName}* 👋, que bom ter você por aqui!`);
  await delay(3000);
  msg.reply(
    "🤖 No que posso te ajudar? \r\n\r\n*[1] !vagas*: lista de vagas. \r\n*[2] !cancelar_inscricao*: cancele o envio de mensagens automáticas. \r\n*[3] !cursos*: lista cursos em alta ou em promoção. \r\n*[4] !sobre*: sobre o projeto. \r\n*[5] !videos*: canais de tecnologia. \r\n*[6] !projetos*: ideias de projetos. \r\n*[7] !feedback*: formulário de feedback. \r\n*[8] !doacao*: faça uma doação."
  );
}
