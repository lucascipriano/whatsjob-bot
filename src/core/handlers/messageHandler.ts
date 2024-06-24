import { Message } from "whatsapp-web.js";
import { delay } from "../utils/delay";
import { supabaseService } from "../services/supabase-service";

interface CommandHandlers {
  [key: string]: (contactName: string, contact: any) => Promise<string> | string;
}

const COMMANDS: CommandHandlers = {
  "Olá, gostaria de me cadastrar na lista para receber as vagas!": handleRegistration,
  "!vagas": handleJobs,
  "!cancelar": handleUnsubscribe,
  "!cursos": handleCourses,
  "!sobre": handleAbout,
  "!canais": handleChannels,
  "!projetos": handleProjects,
  "!feedback": handleFeedback,
  "!doacao": handleDonation,
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

async function handleProjects(contactName: string) {
  return (
    `Confira ideias de projetos no repositório https://github.com/florinpop17/app-ideas para melhorar suas habilidades e construir seu portfólio! 🚀`
  );
}

async function handleRegistration(contactName: string, contact: any) {
  const { data, error } = await supabaseService
    .from("numeros")
    .select("numero")
    .eq("numero", contact.number);

  if (error) {
    return `Desculpe, *${contactName}*. Tivemos um problema ao processar sua inscrição. Por favor, tente novamente mais tarde.`;
  }

  if (data.length > 0) {
    return `Olá *${contactName}*, você já está inscrito na nossa lista para receber as vagas!`;
  }

  const { error: insertError } = await supabaseService
    .from("numeros")
    .insert({ numero: contact.number });

  if (insertError) {
    return `Desculpe, *${contactName}*. Tivemos um problema ao processar sua inscrição. Por favor, tente novamente mais tarde.`;
  }

  return `Olá *${contactName}*, tudo bem? Inscrevi você na nossa lista para receber as vagas! Se quiser se desinscrever é só digitar *!cancelar*`;
}

async function handleUnsubscribe(contactName: string, contact: any) {
  await supabaseService.from("numeros").delete().eq('numero', contact.number);
  return `*${contactName}*, você foi removido da nossa lista para receber as vagas.`;
}

async function handleAbout(contactName: string) {
  return (
    `🤖 Este é um projeto de bot open source que visa ajudar desenvolvedores a conseguir vagas de emprego focadas em TI.\r\n\r\n` +
    `💡 O bot fornece uma lista de vagas atualizadas, informações sobre cursos em alta, ideias de projetos, canais de tecnologia e muito mais.\r\n\r\n` +
    `🌟 Nosso objetivo é facilitar o acesso a oportunidades de trabalho e aprendizado, contribuindo para o crescimento profissional da comunidade de desenvolvedores.\r\n\r\n` +
    `🚀 Esperamos que você encontre muitas oportunidades e recursos úteis através deste serviço!\r\n\r\n` +
    `Obrigado por usar nosso bot!`
  );
}

async function handleFeedback(contactName: string) {
  return (
    `Agradecemos por querer fornecer seu feedback. Por favor, clique no link abaixo para acessar nosso formulário de feedback e nos ajudar a melhorar nossos serviços:\r\n\r\n` +
    `Formulário de Feedback: https://docs.google.com/forms/d/e/1FAIpQLScoYilCfnpASIg1154m3OEToDw1Hp_1mylFx9fl0BciNLx9yA/viewform?usp=sf_link)\r\n\r\n` +
    `Obrigado pelo seu tempo e contribuição!`
  );
}

async function handleCourses(contactName: string) {
  return (
    `Olá *${contactName}*!\r\n\r\n` +
    `Aqui estão alguns cursos que podem te interessar:\r\n\r\n` +
    `1. Curso de React Native\r\n` +
    `   🔗 [Acessar curso: https://youtube.com/playlist?list=PLedVhPP7RyiL0dwk5T2D5_x_lV5KdGP50&si=E54j9_yx6g07Q7TD)\r\n\r\n` +
    `2. Curso de React\r\n` +
    `   🔗 [Acessar curso: https://youtube.com/playlist?list=PLedVhPP7RyiKOiiGMTMYil3yTEoOxO7CK&si=fF9ebRdm-jVlaVCi)\r\n\r\n` +
    `3. Curso de Backend com NestJS\r\n` +
    `   🔗 [Acessar curso: https://youtube.com/playlist?list=PLedVhPP7RyiIOJ7R4lqXtWa4x-GX-x7rO&si=F2DxLsd4dIxQO9ny)\r\n\r\n` +
    `4. Curso de Python\r\n` +
    `   🔗 [Acessar curso: https://youtube.com/playlist?list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6&si=U4HtfNaKsTB1n17Q)\r\n\r\n` +
    `5. Curso de HTML e CSS\r\n` +
    `   🔗 [Acessar curso: https://youtube.com/playlist?list=PLHz_AreHm4dkZ9-atkcmcBaMZdmLHft8n&si=JLTccpKB8h0wHarP)\r\n\r\n` +
    `Aproveite os cursos e bons estudos!`
  );
}

async function handleJobs(contactName: string) {
  const { data, error } = await supabaseService.from("vagas").select("titulo, link, empresa, senioridade, modalidade");

  if (error) {
    return `Desculpe, *${contactName}*. Tivemos um problema ao buscar as vagas. Por favor, tente novamente mais tarde.`;
  }

  if (data.length === 0) {
    return `Olá *${contactName}*. Atualmente, não temos vagas disponíveis.`;
  }

  //let message = `Bom dia pessoal!\r\n\r\nVamos começar o dia com mais vagas na área de TI\r\n\r\n`;
  let message = `Seguem as vagas!\r\n\r\n`;

  data.forEach((vaga: any) => {
    message += 
      `- 🏢 Empresa: ${vaga.empresa}\r\n` +
      `- 🎓 Senioridade: ${vaga.senioridade}\r\n` +
      `- 💼 Vaga: ${vaga.titulo}\r\n` +
      `- 🚩 Modalidade: ${vaga.modalidade}\r\n` +
      `- ❓ Link: ${vaga.link}\r\n\r\n`;
  });

  return message;
}

async function handleDonation(contactName: string) {
  return (
    `Agradecemos por considerar fazer uma doação para apoiar nosso projeto.\r\n\r\n` +
    `Você pode fazer uma doação utilizando a chave Pix abaixo:\r\n\r\n` +
    `🔑 Chave Pix: [SUA_CHAVE_PIX]\r\n\r\n` +
    `Obrigado pelo seu apoio!`
  );
}

async function handleChannels(contactName: string) {
  return (
    `*${contactName}*, segue alguns canais que recomendo você dar uma olhada!\r\n\r\n` +
    `Aqui estão alguns canais de tecnologia que podem te interessar:\r\n\r\n` +
    `1. Código Fonte TV: https://www.youtube.com/@codigofontetv)\r\n` +
    `2. Mano deyvin: https://www.youtube.com/@manodeyvin)\r\n` +
    `3. Rocketseat: https://www.youtube.com/@rocketseat)\r\n` +
    `4. Lucas Montano: https://www.youtube.com/@LucasMontano)\r\n` +
    `5. Fiasco: https://www.youtube.com/@GrandeFiasco)\r\n` +
    `6. Diolinux: https://www.youtube.com/@Diolinux)\r\n` +
    `7. Curso em Vídeo: https://www.youtube.com/c/CursoemV%C3%ADdeo)\r\n` +
    `8. Sujeito programador: https://www.youtube.com/@Sujeitoprogramador)\r\n` +
    `9. Olhar Digital: https://www.youtube.com/@OlharDigital)\r\n` +
    `10. Micael Mota: https://www.youtube.com/@devmicaelomota)\r\n` +
    `11. Léo Andrade: https://www.youtube.com/@leoandradenet)\r\n` +
    `12. Jovem Tranquilão: https://www.youtube.com/c/JovemTranquil%C3%A3o)\r\n` +
    `13. Dev Erik: https://www.youtube.com/@deverik)\r\n` +
    `14. Bolt: https://www.youtube.com/@boltjz)\r\n\r\n` +
    `Aproveite os conteúdos desses canais e bons estudos!`
  );
}

async function handleDefaultMessage(msg: Message, contactName: string) {
  msg.reply(`Olá *${contactName}* 👋, que bom ter você por aqui!`);
  await delay(3000);
  msg.reply(
    "🤖 No que posso te ajudar? \r\n\r\n" +
    "*!vagas*: lista de vagas. \r\n" +
    "*!cancelar*: cancele o envio de mensagens automáticas. \r\n" +
    "*!cursos*: lista cursos em alta ou em promoção. \r\n" +
    "*!sobre*: sobre o projeto. \r\n" +
    "*!canais*: canais de tecnologia. \r\n" +
    "*!projetos*: ideias de projetos. \r\n" +
    "*!feedback*: formulário de feedback. \r\n" +
    "*!doacao*: faça uma doação."
  );
}
