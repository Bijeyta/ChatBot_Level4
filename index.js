const restify = require('restify');

const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');

const { BotActivityHandler } = require('./BotActivityHandler')

const { RootDialogs } = require('./Dialogs/RootDialogs')

//adapter init

const adapter = new BotFrameworkAdapter({
    appId: '',
    appPassword: ''
});

//adapter error handler

adapter.onTurnError = async (context, error) => {
    await context.sendActivity('Error has been encounterd to Bot');
    console.log('Some error has been occured', error);
}

//server creation

const server = restify.createServer();

server.listen(3978, () => {
    console.log(`${server.name} is listing to the port ${server.url}`);
})

const memory = new MemoryStorage();

let conversationState = new ConversationState(memory);

const rootDialog = new RootDialogs(conversationState)
const mainBot = new BotActivityHandler(conversationState, rootDialog);


server.post('/api/messages', (req,res) => {
    adapter.processActivity(req,res, async(context) => {
        await mainBot.run(context);
    })
})