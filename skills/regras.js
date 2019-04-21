const database = require('../data/database'),
    Fuse = require('fuse.js'),
    tiposConectivos = {
        0: 'E',
        1: 'OU'
    },
    tiposOperadores = {
        0: '=',
        1: '<>'
    }

module.exports = function(controller) {

    // Lista todas as regras
    controller.hears('regras', 'message_received', function(bot, message) {
        const regras = database.regras
        let resposta = ''
        
        if (regras < 1) {
            return bot.reply(message, 'Ainda não temos fatos cadastrados no nosso sistema especialista. :(')
        }
        
        resposta = 'Estes são todas as regras cadastradas no nosso sistema especialista: \n\n'
        
        for(regra of regras) {
            resposta = resposta + `* ${regra.Nome} \n`
        }
        
        resposta = resposta + '\n Para detalhar uma regra basta escrever `regra NomeDaRegra`'
        
        bot.reply(message, resposta)
    });

    // Detalhar uma única regra
    controller.hears(['regra (.*)'],'message_received', function(bot, message) {
        const regras = database.regras,
         regra = message.match[1],


         options = {
            keys: ['Nome'],
            threshold: 0.2,
          },
            fuse = new Fuse(regras, options),
            pesquisado = fuse.search(regra)[0]


            if (!pesquisado) {
                return bot.reply(message, 'Não achamos essa regra :/')
            }
            
            let resposta = `A regra **${pesquisado.Nome}** segue a seguinte ordem de validação: \n\n`

            resposta = resposta + `**Se** ${pesquisado.Condicao[0].Fato.Nome} ${tiposOperadores[pesquisado.Condicao[0].Operador]} ${pesquisado.Condicao[0].Resposta.Descricao}`

            for (let i = 1;i < pesquisado.Condicao.length;i++) {
                resposta = resposta + ` **${tiposConectivos[pesquisado.Condicao[i].Conectivo]}** \n\n ${pesquisado.Condicao[i].Fato.Nome} ${tiposOperadores[pesquisado.Condicao[i].Operador]} ${pesquisado.Condicao[i].Resposta.Descricao}`
            }

            resposta = resposta + `\n\n **Então** ${pesquisado.condicaoObjetivos[0].Fato.Nome} ${tiposOperadores[pesquisado.condicaoObjetivos[0].Operador]} ${pesquisado.condicaoObjetivos[0].Resposta.Descricao}`
            
            bot.reply(message, resposta)
});

    
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