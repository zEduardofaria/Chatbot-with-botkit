const database = require('../data/database'),
    Fuse = require('fuse.js');

    const tiposFatos = {
        0: 'univalorado',
        1: 'multivalorado',
        2: 'numérico'
    }
    
    module.exports = function(controller) {
        
        // Lista todos os fatos
        controller.hears(['fatos', 'variaveis'], 'message_received', function(bot, message) {
            const fatos = database.fatos
            let resposta = ''
            
            if (fatos < 1) {
                return bot.reply(message, 'Ainda não temos fatos cadastrados no nosso sistema especialista. :(')
            }
            
            resposta = 'Estes são todos os fatos cadastrados no nosso sistema especialista: \n\n'
            
            for(fato of fatos) {
                resposta = resposta + `* ${fato.Nome} \n`
            }
            
            resposta = resposta + '\n Para detalhar um fato basta escrever `fato NomeDoFato`'
            
            bot.reply(message, resposta)
        });
        
        // Detalhar um único fato
        controller.hears(['fato (.*)'],'message_received', function(bot, message) {
            const fatos = database.fatos,
             fato = message.match[1],

             options = {
                keys: ['Nome'],
                threshold: 0.1,
              },
                fuse = new Fuse(fatos, options),
                pesquisado = fuse.search(fato)[0]

                console.log("TCL: pesquisado", pesquisado)

                if (!pesquisado) {
                    bot.reply(message, 'Não temos este fato cadastrado no sistema. Digite **fatos** para você saber quais fatos temos salvo.')
                }

                if (pesquisado.Tipo === 2) {
                    let resposta = `O fato **${pesquisado.Nome}** é do tipo **${tiposFatos[pesquisado.Tipo]}** e as respostas podem variar de **${pesquisado.Respostas[0].Descricao}** a **${pesquisado.Respostas[1].Descricao}**`
                    
                    bot.reply(message, resposta)
                } else {
                    let resposta = `O fato **${pesquisado.Nome}** é do tipo **${tiposFatos[pesquisado.Tipo]}** e contém as seguintes opções de resposta: \n\n`

                    for(const opcao of pesquisado.Respostas) {
                        resposta = resposta + `* ${opcao.Descricao} \n`
                    }

                    bot.reply(message, resposta)            
                }


    });

}
