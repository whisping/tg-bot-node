const Telegraf = require('telegraf');
require('dotenv').config()



const bot = new Telegraf(process.env.BOT_TOKEN);

const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const Markup = require('telegraf/markup')


// Сцена создания нового матча.
const create = new WizardScene(
    "create", // Имя сцены
    (ctx) => {
        ctx.reply('Step 1', Markup.inlineKeyboard([
            Markup.urlButton('❤️', 'http://telegraf.js.org'),
            Markup.callbackButton('➡️ Next', 'next')
        ]).extra());
        ctx.reply('Этап 1: выбор типа матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        ctx.reply('Этап 2: выбор времени проведения матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        if (ctx.message.text === "Назад") {
            ctx.wizard.back(); // Вернуться к предыдущиму обработчику
        }
        ctx.reply('Этап 3: выбор места проведения матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },

    // ...

    (ctx) => {
        ctx.reply('Финальный этап: создание матча.');
        ctx.reply("Thanx, that's all.");
        return ctx.scene.leave();
    }
);

// Создаем менеджера сцен
const stage = new Stage();

// Регистрируем сцену создания матча
stage.register(create);

bot.use(session());
bot.use(stage.middleware());
bot.action("create", (ctx) => ctx.scene.enter("create"));

// ...


/// BUTTON
const testMenu = Telegraf.Extra
  .markdown()
  .markup((m) => m.inlineKeyboard([
    m.callbackButton('Find button', 'find'),
    m.callbackButton('Find button', 'find')
 ]));


bot.start((ctx) => {
    ctx.reply('Welcome!\nMy name is ' + ctx.botInfo.username + '\nYour name is ' + ctx.message.from.username + "\ntype /help for help",
    testMenu);
  //   ctx.reply("BUTTON", Markup.inlineKeyboard([
  //   testMenu,
  //   testMenu
  // ]).extra());

});

bot.help((ctx) => {
    ctx.reply("============================\nThis is empty (for now) help\ntype /start to start\n============================");
})

// for any /find messages
bot.action("find", (ctx) => {
    ctx.reply("Find what?");
})

// any text
bot.on('text', (ctx) => {
    const user = ctx.message.from.username;
    ctx.reply("Dear " + user + "!\nNow I don't understand you. But it'll changes soon!");
    console.log("DETECTED: " + user);
    console.log(ctx.message.text);
});

bot.launch();
