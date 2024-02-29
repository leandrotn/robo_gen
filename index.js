const fs = require('fs');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');

const url = 'https://api.discord.gx.games/v1/direct-fulfillment';  //api promocional discord
const id = '1161769335442899024';  //id da promoção
const botToken = '';  // Substitua com o token do seu bot
const canalId = '';  // Substitua com o ID do canal

const client = new Client({
  intents: [0],
});

client.once('ready', () => {
  console.log('Bot pronto para enviar códigos!');
  setInterval(() => gerarEImprimirTokens(100), 180000); // Gera 100 códigos a cada 3 minutos
});

client.login(botToken);

const generateRandomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

const headers = {
    'authority': 'api.discord.gx.games',
    'accept': '*/*',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://www.opera.com',
    'referer': 'https://www.opera.com/',
    'sec-ch-ua': '"Opera GX";v="105", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0'
};
const gerarEImprimirTokens = async (quantidade) => {
  for (let i = 0; i < quantidade; i++) {
    try {
      const data = {
        'partnerUserId': generateRandomString(64),
      };

      const resposta = await axios.post(url, data, { headers });

      if (resposta.status === 200) {
        const token = resposta.data.token;
        const codigo = `https://discord.com/billing/partner-promotions/${id}/${token}`;
        //console.log(codigo);

        const canal = await client.channels.fetch(canalId);
        canal.send(codigo);
      } else if (resposta.status === 429) {
        console.log('Limite de requisições excedido! Aguardando um minuto para permitir o resfriamento.');
        await new Promise(resolve => setTimeout(resolve, 60000));
      } else if (resposta.status === 504) {
        console.log('Servidor expirou! Tentando novamente em 5 segundos.');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log(`Falha na requisição com código de status ${resposta.status}.`);
        console.log(`Mensagem de erro: ${resposta.data}`);
      }
    } catch (erro) {
      console.log(`Ocorreu um erro: ${erro}`);
    }
  }
};
