const TelegramBotApi = require('node-telegram-bot-api')

const { gameOptions, newGameOptions } = require('./options')

const token = '6210942834:AAHV_BftYRtzwjXfZ8gHdI0KIPaA7QaEKW4'

const bot = new TelegramBotApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage( chatId, `Загадываю число от 0 до 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Пришлите догадку`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/game', description: 'Угадать число' },
        { command: '/about', description: 'О боте' },
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            return bot.sendMessage( chatId, `Здравствуйте! Это бот проверки заказов сайта NVRVIKIN Store`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if(text === '/about') {
            return bot.sendMessage( chatId, `${msg.from.first_name}, c помощью этого бота Вы можете проверить статус заказа по его номеру.`)
        } 
        
        return bot.sendMessage( chatId, `Получено: ${text}`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Верно! Я загадывал число ${chats[chatId]}`, newGameOptions)
        } else {
            return bot.sendMessage(chatId, `Неверно. Я загадывал ${chats[chatId]}`, newGameOptions)
        }
    })
}

start()