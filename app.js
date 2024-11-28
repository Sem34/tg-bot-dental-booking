import TelegramBot from 'node-telegram-bot-api';
import dataBot from './values.js';

const bot = new TelegramBot(dataBot.token, { polling: true });

// Додаємо команди в меню
bot.setMyCommands([
  { command: '/new_booking', description: 'Нове бронювання' },
]);

// Обробка команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
🦷 Вітаємо у нашій стоматології!
Ми дбаємо про вашу усмішку та готові допомогти з будь-якими питаннями! 💙

📅 Запишіться на прийом всього в кілька кліків.
Обирайте зручний час та отримуйте професійний догляд.

👇 Натисніть "Поділитися номером", щоб здійнити запис.
`, {
    reply_markup: {
      keyboard: [
        [
          { text: '📞 Поділитися номером', request_contact: true },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

// Зберігання контактів для користувачів
const userContacts = {};

// Обробка події contact
bot.on('contact', (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  const userName = contact.first_name || 'Клієнт';
  const phoneNumber = contact.phone_number;

  // Зберігаємо дані контакту
  userContacts[chatId] = { userName, phoneNumber };

  // Формуємо Calendly URL без email
  const calendlyUrl = `https://calendly.com/infodentalhouse-proton/zapys-do-stomatologa?name=${encodeURIComponent(userName)}&phone=${encodeURIComponent(phoneNumber)}`;

  // Повідомлення користувачу
  bot.sendMessage(chatId, `
✅ Ваші дані отримано!

📲 Телефон: ${phoneNumber}  
📝 Ім’я: ${userName}

📅 Для завершення процесу та запису на зустріч перейдіть за посиланням:
🔗 ${calendlyUrl}
`, {
    reply_markup: {
      keyboard: [['🆕 Нове бронювання']],
      resize_keyboard: true,
    },
  });
});

// Обробка кнопки "Нове бронювання"
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '🆕 Нове бронювання') {
    const userData = userContacts[chatId];

    if (!userData) {
      return bot.sendMessage(chatId, `❌ Ви ще не поділилися своїми контактними даними. Натисніть "📞 Поділитися номером" для продовження.`);
    }

    const { userName, phoneNumber } = userData;

    const calendlyUrl = `https://calendly.com/infodentalhouse-proton/zapys-do-stomatologa?name=${encodeURIComponent(userName)}&phone=${encodeURIComponent(phoneNumber)}`;

    bot.sendMessage(chatId, `
✅ Ваші дані отримано!

📲 Телефон: ${phoneNumber}  
📝 Ім’я: ${userName}

📅 Для завершення процесу та запису на зустріч перейдіть за посиланням:
🔗 ${calendlyUrl}
`, {
      reply_markup: {
        keyboard: [['🆕 Нове бронювання']],
        resize_keyboard: true,
      },
    });
  }
});

// Обробка команди /new_booking
bot.onText(/\/new_booking/, (msg) => {
  const chatId = msg.chat.id;

  const userData = userContacts[chatId];

  if (!userData) {
    return bot.sendMessage(chatId, `❌ Ви ще не поділилися своїми контактними даними. Натисніть "📞 Поділитися номером" для продовження.`);
  }

  const { userName, phoneNumber } = userData;

  const calendlyUrl = `https://calendly.com/infodentalhouse-proton/zapys-do-stomatologa?name=${encodeURIComponent(userName)}&phone=${encodeURIComponent(phoneNumber)}`;

  bot.sendMessage(chatId, `
✅ Ваші дані отримано!

📲 Телефон: ${phoneNumber}  
📝 Ім’я: ${userName}

📅 Для завершення процесу та запису на зустріч перейдіть за посиланням:
🔗 ${calendlyUrl}
`, {
    reply_markup: {
      keyboard: [['🆕 Нове бронювання']],
      resize_keyboard: true,
    },
  });
});
