const database = require('../data/database'),
    Fuse = require('fuse.js');

module.exports = function(controller) {
    
    // Play em uma regra
    controller.hears(['play (.*)', 'start (.*)', 'começar (.*)'], 'message_received', function(bot, message) {
        const regras = database.regras
        regra = message.match[1],

             options = {
                keys: ['Nome'],
                threshold: 0.2,
              },
                fuse = new Fuse(regras, options),
                pesquisado = fuse.search(regra)[0]

                console.log(pesquisado)
        
        const respostas = []
        
        bot.createConversation(message, (err, convo) => {
            
            convo.addMessage(`Ei humano, nós vamos testar a regra **${pesquisado.Nome}**. Vamos começar!`)
            
            for (const pergunta in pesquisado.Condicao) {
                const proxima = pesquisado.Condicao.length === parseInt(pergunta, 10) + 1 ? 'end' : `p${parseInt(pergunta, 10) + 1}`
                const atual = pesquisado.Condicao[pergunta].Primeiro ? 'default' : `p${pergunta}`

                convo.addQuestion(`${pesquisado.Condicao[pergunta].Fato.Nome} ?`, (res, convo) => {
                    respostas.push(res)
                    convo.gotoThread(proxima)
                }, {}, atual)            
            }           
            
            convo.addMessage('Okay, muito obrigado pelas informações, humano. Aguarde um instante', 'end')
            
            convo.activate();
        })
                
        const tratarRespostas = (respostas) => {
            console.log("TCL: tratarRespostas -> respostas", respostas)
        }
    })


}