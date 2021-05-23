const { ActivityHandler, CardFactory} = require('botbuilder')

class BotActivityHandler extends ActivityHandler {
    constructor(conversationState, rootDialog) {
        super();
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;

        this.accessor = this.conversationState.createProperty('DialogAccessor');
        this.onMessage(async (context,next) => {
            await this.rootDialog.run(context, this.accessor);
            await next();
        })
        this.onConversationUpdate(async (context) => {
            if(context.activity.membersAdded && context.activity.membersAdded[1].id == context.activity.from.id) {
                await context.sendActivity({
                    attachments: [CardFactory.adaptiveCard({
                        "type": "AdaptiveCard",
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.3",
                        "body": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                                                "size": "Medium"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "wrap": true,
                                                "text": "Celebal Technology",
                                                "size": "Medium",
                                                "fontType": "Default",
                                                "weight": "Bolder",
                                                "color": "Warning"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "TextBlock",
                                "wrap": true,
                                "text": "Welcome to Celebal Technology, This is CT-Lusia, your personal assistant. I can help you in HR and IT.",
                                "color": "Dark"
                            }
                        ]
                    })]
                });

                await context.sendActivity({
                    attachments: [CardFactory.heroCard(
                        'Here are some suggestions that you can try',
                        null,
                        CardFactory.actions([
                            {
                                type: 'imBack',
                                title: 'Leave Application',
                                value: 'Leave Application'
                            },
                            {
                                type: 'imBack',
                                title: 'Payroll',
                                value: 'Payroll'
                            },
                            {
                                type: 'imBack',
                                title: 'Recruitment',
                                value: 'Recruitment'
                            }
                            
                        ])
                    )]
                });
            }
        })
    }
    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context);
    }
}

module.exports.BotActivityHandler = BotActivityHandler;