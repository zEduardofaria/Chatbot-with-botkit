const database = require('../data/database'),
    Fuse = require('fuse.js');

    const tiposObjetivos = {
        0: 'univalorado',
        1: 'multivalorado',
        2: 'numérico'
    }
    
    module.exports = function(controller) {
        
        // Lista todos os objetivos
        controller.hears(['objetivos', 'variaveis'], 'message_received', function(bot, message) {
            const objetivos = database.ObjetivosAlvo
            let resposta = ''
            
            if (objetivos < 1) {
                return bot.reply(message, 'Ainda não temos objetivos cadastrados no nosso sistema especialista. :(')
            }
            
            resposta = 'Estes são todos os objetivos cadastrados no nosso sistema especialista: \n\n'
            
            for(objetivo of objetivos) {
                resposta = resposta + `* ${objetivo.Nome} \n`
            }
            
            resposta = resposta + '\n Para detalhar um objetivo basta escrever `objetivo NomeDoObjetivo`'
            
            bot.reply(message, resposta)
        });
        
        // Detalhar um único objetivo
        controller.hears(['objetivo (.*)'],'message_received', function(bot, message) {
            const objetivos = database.ObjetivosAlvo,
             objetivo = message.match[1],

             options = {
                keys: ['Nome'],
                threshold: 0.1,
              },
                fuse = new Fuse(objetivos, options),
                pesquisado = fuse.search(objetivo)[0]

                if (!pesquisado) {
                    bot.reply(message, 'Não temos este objetivo cadastrado no sistema. Digite **objetivos** para você saber quais objetivos temos salvo.')
                }

                if (pesquisado.Tipo === 2) {
                    let resposta = `O objetivo **${pesquisado.Nome}** é do tipo **${tiposObjetivos[pesquisado.Tipo]}** e as respostas podem variar de **${pesquisado.Respostas[0].Descricao}** a **${pesquisado.Respostas[1].Descricao}**`
                    
                    bot.reply(message, resposta)
                } else {
                    let resposta = `O objetivo **${pesquisado.Nome}** é do tipo **${tiposObjetivos[pesquisado.Tipo]}** e contém as seguintes opções de resposta: \n\n`

                    for(const opcao of pesquisado.Respostas) {
                        resposta = resposta + `* ${opcao.Descricao} \n`
                    }

                    bot.reply(message, resposta)            
                }


    });

}
