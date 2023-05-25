let { log, clear } = console;
clear();
import Telegram from "node-telegram-bot-api";
import { xodim } from "../database/qustions.js";
const bot = new Telegram("token bo'lishi kerak bu yerda", {
  polling: true,
});
const admin = 5150639267;
const chanal = "@botuchunmaxsuskanal";
const customers = {};
let commands = [
  "Sherik kerak",
  "Ish joyi kerak",
  "Hodim kerak",
  "Ustoz kerak",
  "Shogird kerak",
];
bot.onText(/\/start/, async (msg) => {
  try {
    log(msg);
    const { id } = msg.from;
    await bot.sendMessage(
      id,
      `Assalom alaykum ${msg.from.first_name}
        UstozShogird kanalining rasmiy botiga xush kelibsiz!
    
    /help yordam buyrugi orqali nimalarga qodir ekanligimni bilib oling!`,
      {
        reply_markup: {
          keyboard: [
            [{ text: "Sherik kerak" }, { text: "Ish joyi kerak" }],
            [{ text: "Hodim kerak" }, { text: "Ustoz kerak" }],
            [{ text: "Shogird kerak" }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } catch (error) {}
});

async function* qustion() {
  while (1) {
    let [id, savol] = yield;
    await bot.sendMessage(id, savol);
  }
}
let gen = qustion();
gen.next();

let count = 0;
bot.on("message", async (msg) => {
  try {
    console.log(msg);
    const { id } = msg.from;
    if (msg.text == "/start" || msg.from.is_bot) return;
    if (!customers[id] || commands.includes(msg.text)) {
      await bot.sendMessage(
        id,
        msg.text.slice(0, msg.text.length - 6) +
          " topish uchun ariza berish\n Hozir sizga birnecha savollar beriladi.\n Har biriga javob bering. \n Oxirida agar hammasi to`g`ri bo`lsa, HA tugmasini bosing va arizangiz Adminga yuboriladi."
      );
      customers[id] = [];
      count = 0;
    }
    customers[id].push(msg.text);
    if (count < xodim.length) gen.next([id, xodim[count++]]);
    else {
      await bot.sendMessage(id, render(id, msg.from.username), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅", callback_data: "yes" },
              { text: "❌", callback_data: "no" },
            ],
          ],
        },
      });
    }
  } catch (error) {}
});

bot.on("callback_query", async (msg) => {
  try {
    const { id } = msg.from;
    log(msg);

    if (msg.data == "yes") {
      if (msg.from.id == admin) {
        let t = msg.message.text;
        let user = t.slice(t.length - 10, t.length);
        let username = t.split(" ").find((e) => e[0] == "@");
        log(username);
        await bot.sendMessage(
          chanal,
          render(
            user,
            username,
            "👉 @botuchunmaxsuskanal kanaliga ulanish (https://t.me/+y29hGhzR_r80ODAy)"
          )
        );
        await bot.deleteMessage(admin, msg.message.message_id);
      }
      await bot.sendMessage(admin, render(id, msg.from.username) + "\n" + id, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅", callback_data: "yes" },
              { text: "❌", callback_data: "no" },
            ],
          ],
        },
      });
    }
    await bot.deleteMessage(id, msg.message.message_id);
  } catch (error) {}
});

function render(id, username, rek = "") {
  return `${customers[id][0]}:
        
    👨‍💼 Xodim: ${customers[id][1]}
    🕑 Yosh: ${customers[id][2]}
    📚 Texnologiya: ${customers[id][3]} 
    🇺🇿 Telegram: @${username} 
    📞 Aloqa: ${customers[id][4]} 
    🌐 Hudud: ${customers[id][5]}
    💰 Narxi: $${customers[id][6]} 
    🕰 Murojaat qilish vaqti: ${customers[id][7]}
    🔎 Maqsad: ${customers[id][8]} 
    
    #xodim #bootstrap #css #html #javaScript #react #${customers[id][5]}

    ${rek}
    `;
}
