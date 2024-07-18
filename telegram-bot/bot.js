const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '7235435211:AAGsZwLYcdgHekw6NGlUhtqiefHUqkn4WvU';

const bot = new TelegramBot(token, { polling: true });

const saveUserData = (user) => {
  const data = {
    id: user.id,
    username: user.username || 'Not set',
    first_name: user.first_name,
    last_name: user.last_name || 'Not set',
    language_code: user.language_code
  };

  // Read existing user data
  let users = [];
  if (fs.existsSync('userdata.json')) {
    const fileData = fs.readFileSync('userdata.json');
    users = JSON.parse(fileData);
  }

  // Add or update the user data
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex >= 0) {
    users[userIndex] = data;
  } else {
    users.push(data);
  }

  // Write updated user data back to the file
  fs.writeFileSync('userdata.json', JSON.stringify(users, null, 2));
};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    const user = msg.from;

    saveUserData(user);

    const userDetails = `
Userid: \`${user.id}\`
Username: ${user.username || 'Not set'}
First name: ${user.first_name}
Last name: ${user.last_name || 'Not set'}
Language Code: ${user.language_code}
    `;

    bot.sendMessage(chatId, `Hello, here are your details:\n${userDetails}`, { parse_mode: 'Markdown' });
  }
});
