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
            
            convo.addMessage(`Nós vamos testar a regra **${pesquisado.Nome}**. Vamos começar!`)
            
            for (const pergunta in pesquisado.Condicao) {
                const proxima = pesquisado.Condicao.length === parseInt(pergunta, 10) + 1 ? 'end' : `p${parseInt(pergunta, 10) + 1}`
                const atual = pesquisado.Condicao[pergunta].Primeiro ? 'default' : `p${pergunta}`

                convo.addQuestion(`${pesquisado.Condicao[pergunta].Fato.Nome} ?`, (res, convo) => {
                    respostas.push(res)
                    if (proxima === 'end') {
                        tratarRespostas(respostas)
                    }
                    convo.gotoThread(proxima)
                }, {}, atual)            
            }           
            
            convo.addMessage('Tudo ok e ready for rock n roll!', 'end')
            
            convo.activate();
        })
                
        const tratarRespostas = (respostas) => {
            let resultadoRegra = true

            for (const pergunta in pesquisado.Condicao) {
                if (pesquisado.Condicao[pergunta].Resposta.Descricao.toLowerCase() !== respostas[pergunta].text) {
                    resultadoRegra = false
                }
            }
            
            if (resultadoRegra) {
                bot.reply(message, `Deu certo! Testamos a regra **${pesquisado.Nome}**, e o resultado obtido foi: \n\n 
                ${pesquisado.condicaoObjetivos[0].Fato.Nome} é ${pesquisado.condicaoObjetivos[0].Resposta.Descricao}
                `)
            } else {
                bot.reply(message, `Testamos a regra **${pesquisado.Nome}**, e com o valor das suas respostas não podemos confirmar que ${pesquisado.condicaoObjetivos[0].Fato.Nome} é ${pesquisado.condicaoObjetivos[0].Resposta.Descricao} :(`)
            }
        }
    })


}