const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { rootDialog, leaveappDialog } = require('../Constants/DialogIds')
const { LeaveappDialog } = require('./classes');

const parseMessage = 'parseMessage';

class RootDialogs extends ComponentDialog {

    constructor(conversationState){

        super(rootDialog)

        if(!conversationState) throw new Error ('Conversation state id required')

        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(parseMessage, [

            this.routeMessage.bind(this)
        ]));

        // this.addDialog(new PayrollDialog(conversationState));

        this.addDialog(new LeaveappDialog(conversationState));

        // this.addDialog(new RecruitmentDialog(conversationState));

        this.initialDialogId = parseMessage;
    }
    async run(context, accessor){
        try {
            const dialogSet = new DialogSet(accessor)
            dialogSet.add(this)
            const dialogContext = await dialogSet.createContext(context);
            const results = await dialogContext.continueDialog();
            if(results && results.status === DialogTurnStatus.empty){
                await dialogContext.beginDialog(this.id);
            } else {
                console.log('dialog stack is empty');
            } 
        } catch(err) {
            console.log(err);
        }
    }
    async routeMessage(stepContext) {
        console.log(stepContext.context.activity.value)
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'leave application':
                return await stepContext.beginDialog(leaveappDialog);
            case 'payroll':
                await context.sendActivity('hii');
                break;
            case 'recruitment':
                await context.sendActivity('hello');
                break;
            default: 
                await context.sendActivity('Sorry I am still learning can you please refresh you queries');
        }
    }
}

module.exports.RootDialogs = RootDialogs