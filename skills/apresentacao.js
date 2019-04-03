/* This module kicks in if no Botkit Studio token has been provided */

module.exports = function(controller) {

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);

    function conductOnboarding(bot, message) {

      bot.startConversation(message, function(err, convo) {

        convo.say({
          text: 'Olá, humano! Eu sou um chatbot baseado em Sistemas Especialistas. Digite `ajuda` caso ainda não saiba como se comunicar :)',
          quick_replies: [
            {
              title: 'Ajuda',
              payload: 'ajuda',
            },
          ]
        });


      });

    }

    controller.hears(['ajuda','contato','doc','documentação','help','contact','documentation','docs','community'], 'message_received', function(bot, message) {

      bot.startConversation(message, function(err, convo) {

        // set up a menu thread which other threads can point at.
        convo.ask({
          text: 'Como posso ajudar?',
          quick_replies: [
            {
              title: 'Fatos',
              payload: 'fato',
            },
            {
              title: 'Objetivos',
              payload: 'objetivo',
            },
            {
              title: 'Regras',
              payload: 'regra',
            },
            {
              title: 'Detalhar um item',
              payload: 'community',
            },
            {
              title: 'Testar uma regra',
              payload: 'contact us',
            },
          ]
        },[
          {
            pattern: 'fato',
            callback: function(res, convo) {
              convo.gotoThread('fact');
              convo.next();
            }
          },
          {
            pattern: 'objetivo',
            callback: function(res, convo) {
              convo.gotoThread('goal');
              convo.next();
            }
          },
          {
            pattern: 'regra',
            callback: function(res, convo) {
              convo.gotoThread('rule');
              convo.next();
            }
          },
          {
            default: true,
            callback: function(res, convo) {
              convo.gotoThread('end');
            }
          }
        ]);

        // set up docs threads
        convo.addMessage({
          text: 'Eu ainda não posso ajudar com isso. Diga `ajuda` a qualquer momento para acessar o menu.'
        },'end');
                
        // set up docs threads
        convo.addMessage({
          text: 'Para ter acesso a todos os fatos cadastrados no sistema, basta digitar `fatos`.',
        },'fact');

        convo.addMessage({
          text: 'Para ter acesso a todos os objetivos cadastrados no sistema, basta digitar `objetivos`.',
        },'goal');

        convo.addMessage({
          text: 'Para ter acesso a todas as regras cadastradas no sistema, basta digitar `regras`.',
        },'rule');

        convo.addMessage({
          action: 'default'
        }, 'docs');
      });

    });


}
