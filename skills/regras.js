module.exports = function(controller) {
    // Chaining multiple questions together using callbacks
    // You have to call convo.next() in each callback in order to keep the conversation flowing
    controller.hears('qq', 'message_received', function(bot, message) {
        bot.startConversation(message, function(err, convo) {
            convo.say('Lets get to know each other a little bit!')

            convo.ask('Which is more offensive? Book burning or flag burning?', function(res, convo) {
                convo.next()

                convo.ask('How often do you keep your promises?', function(res, convo) {
                    convo.next()

                    convo.ask('Which is bigger? The Sun or the Earth?', function(res, convo) {

                        convo.say('Thank you, that is all for now')
                        convo.next()

                    })
                })
            })
        })
    })

    // Method using threads and addQuestion
    // Helps you avoid callback hell
    // Docs for addQuestion https://github.com/howdyai/botkit/blob/master/readme.md#convoaddquestion
    // Don't forget to pass an empty object after the callback and before the thread you're adding the question to!
    controller.hears('regras123', 'message_received', function(bot, message) {
        const respostas = []
        bot.createConversation(message, (err, convo) => {
            
            convo.addMessage('Charmed to meet you, lets get to know one another!')
            
            convo.addQuestion('How much do you like robots?', (res, convo) => {
                respostas.push(res)
                convo.gotoThread('q2')
            }, {}, 'default')
            
            
            convo.addQuestion('Do you like your job?', (res, convo) => {
                respostas.push(res)
                convo.gotoThread('q3')
            }, {}, 'q2')
            
            convo.addQuestion('How much glucose and energy does your body generate per hour?', (res, convo) => {
                respostas.push(res)
                tratarRespostas(respostas)
                convo.gotoThread('end')
            }, {}, 'q3')
            
            
            convo.addMessage('Okay thank you very much for the valuable info, human.', 'end')
            
            convo.activate();
        })
                
        const tratarRespostas = (respostas) => {
            console.log("TCL: tratarRespostas -> respostas", respostas)
        }
    })


}