const { ComponentDialog, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');
const { leaveappDialog } = require('../Constants/DialogIds');
const { confirmleave } = require('../cards/cards')

const leaveappDialogWF1 = 'leaveappDialogWF1';
const leaveappDialogwithFormWF1 = 'leaveappDialogwithFormWF1'
const ChoicePromptDialog = 'ChoicePromptDialog'
const NumberPromptDialog = 'NumberPromptDialog'
const TextPromptDialog = 'TextPromptDialog'


class LeaveappDialog extends ComponentDialog{

    constructor(conversationState) {
        super(leaveappDialog);

        if(!conversationState) throw new Error ('ConversationState state required');

        this.conversationState = conversationState;
        this.applyLeaveStateAccessor = this.conversationState.createProperty('ApplyLeaveState');
        this.addDialog(new ChoicePrompt(ChoicePromptDialog));
        this.addDialog(new NumberPrompt(NumberPromptDialog));
        this.addDialog(new TextPrompt(TextPromptDialog));

        this.addDialog(new WaterfallDialog(leaveappDialogWF1,[
            this.askleavetype.bind(this),
            this.askNoOfDays.bind(this),
            this.askleavedate.bind(this),
            this.applyApplication.bind(this)
        ]));

        this.initialDialogId = leaveappDialogWF1;
    }

    async askleavetype(stepContext) {
        return await stepContext.prompt(ChoicePromptDialog, {
            prompt: 'Please help me with the type of leave you want to apply for',
            choices: ChoiceFactory.toChoices(['Sick leave','Casual leave','Earned leave'])
        })
    }
    async askNoOfDays(stepContext) {
        let dialogDate = await this.applyLeaveStateAccessor.get(stepContext.context, {});
        dialogDate.leaveType = stepContext.result.value;
        console.log(dialogDate);
        return await stepContext.prompt(NumberPromptDialog,`For how many days you want to apply ${dialogDate.leaveType}` ) 
    }

    async askleavedate(stepContext) {
        let dialogDate = await this.applyLeaveStateAccessor.get(stepContext.context);
        dialogDate.leavedays = stepContext.result;
        return await stepContext.prompt(TextPromptDialog,`From which date I should apply this ${dialogDate.leaveType} application` )
    }

    async applyApplication(stepContext) {
        let dialogDate = await this.applyLeaveStateAccessor.get(stepContext.context);
        dialogDate.leavedate = stepContext.result;
        await stepContext.context.sendActivity({
            attachments: [
                CardFactory.adaptiveCard(confirmleave(dialogDate.leaveType,dialogDate.leavedays,dialogDate.leavedate))
            ]
        });
        return stepContext.endDialog();
        
    }
}


module.exports.LeaveappDialog = LeaveappDialog;