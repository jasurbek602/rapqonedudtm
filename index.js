const TelegramBot = require('node-telegram-bot-api');

const token = '7937721160:AAHhMSr3XSENMS1hNyttkZcwFzb1vc26vcY'; // Tokeningizni bu yerga yozing
const adminChatId = 2053660453;
const adminCha = 1915666976;
const bot = new TelegramBot(token, { polling: true });

var userSteps = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userSteps[chatId] = { step: 0 };
  
  const welcome = `Assalomu alaykum!\nSiz 🏛 Rapqon Education | o‘quv markazi tomonidan tashkil etilgan DTM diagnostik testida ishtirok etish uchun ro‘yxatdan o‘tmoqdasiz.\n\n\nIshtirok narxi: 10 000 so‘m\nBilimingizni sinab ko‘ring va natijangizni DTM mezonlari asosida baholang!\n\nIltimos, ta’lim yo‘nalishingizni tanlang:`;

  const options = {
    reply_markup: {
      keyboard: [
        ['Matematika — Ingiliz tili'],     ['Matematika — Ona tili'],  
        ['Matematika — Fizika'],           ['Fizika — Matematika'],  
        ['Ona tili — Ingiliz tili'],       ['Ingiliz tili — Ona tili'],  
        ['Biologiya — Ona tili'],          ['Biologiya — Kimyo'],  
        ['Kimyo — Biologiya'],             ['Kimyo — Matematika'],  
        ['Tarix — Ona tili'],              ['Tarix — Ingiliz tili'],  
        ['Huquq — Ingiliz tili'],          ['Geografiya — Matematika']
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, welcome, options);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore command messages other than /start
  if (text.startsWith('/') && text !== '/start') return;

  var stepData = userSteps[chatId];

  if (!stepData) return; // Agar userSteps mavjud bo‘lmasa, hech narsa qilmaydi

  var step = stepData.step;

  if (step == 0) {
    bot.sendMessage(chatId, "Iltimos, ism va familiyangizni kiriting:");
      stepData.fan = text;
    
    stepData.step = 1;
} else if (step === 1) {
    stepData.name = text;
    stepData.step = 2;
    bot.sendMessage(chatId, "Sinfingizni tanlang:", {
      reply_markup: {
        keyboard: [
          ['11-sinf'],
          ['10-sinf'],
          ['9-sinf'],
          ['8-sinf'],
          ['Boshqa']
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } else if (step === 2) {
    stepData.class = text;
    stepData.step = 3;
    bot.sendMessage(chatId, "Telefon raqamingizni yuboring:");
  } else if (step === 3) {
    stepData.phone = text;
    var info = `📥 *Yangi ro‘yxatdan o‘tuvchi:*\n\n *Fan: ${stepData.fan}\n*Ism: ${stepData.name}\n*Sinf: ${stepData.class}\n*Telefon: ${stepData.phone}\n*Username: @${msg.chat.username}`;
    bot.sendMessage(chatId, info);
    
    bot.sendMessage(chatId, "Tepadagi malumotlar to'g'riligiga ishonch hosil qiling\nAgar ma'lumotlar to'g'ri bo‘lsa 'Yuborish ✅' ni,\nnoto‘g‘ri bo‘lsa 'Xato❌' ni bosing:", {
        reply_markup: {
          keyboard: [
            ['Yuborish ✅'],
            ['Xato❌']
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
  
      stepData.step = 4;
    } else if (step === 4) {
      if (text === 'Yuborish ✅') {
        var info = `📥 *Yangi ro‘yxatdan o‘tuvchi:*\n\n *Fan: ${stepData.fan}\n*Ism: ${stepData.name}\n*Sinf: ${stepData.class}\n*Telefon: ${stepData.phone}\n*Username: @${msg.chat.username}`;
        bot.sendMessage(adminChatId, info);
        bot.sendMessage(adminCha, info);
        bot.sendMessage(chatId, "✅ Ma’lumotlaringiz yuborildi! Tez orada siz bilan bog‘lanamiz.\n/start buyrug‘ini bosib qayta boshlashingiz mumkin.");
        delete userSteps[chatId];
      } else if (text === 'Xato❌') {
        bot.sendMessage(chatId, "❌ Ma’lumotlaringiz bekor qilindi. /start buyrug‘i orqali qayta boshlang.");
        delete userSteps[chatId];
      }
    }
  }); 
