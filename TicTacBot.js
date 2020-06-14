const Telegraf = require('telegraf')

const Markup = require('telegraf/markup')
var MinMax = require("./MinMax");
MinMax.start();
const bot = new Telegraf("1247271544:AAENpebtXX0xqZSoYsOWTPloZmQfoLfnNvo")

const PLAYER = 1;
const AI = 2;

var turno = AI;
//SEMPRE QUE UM BOTAO DE CALLBACK FOR CHAMADO
bot.on('callback_query', async(ctx, next) =>{

	if (ctx.update.callback_query.data.includes("★") && turno == PLAYER){
		turno = AI;
		var splited = ctx.update.callback_query.data.split("!");
		var g = ctx.update.callback_query.message.reply_markup.inline_keyboard;
		var game = [];
		for(i in g){
			for(j in g[i]){
				game.push(g[i][j].text);
			}
		}
		var win = MinMax.wintoria(game);
		if(win != Infinity){
			ctx.answerCbQuery()
			return;
		}
		var game = MinMax.arrayToStringArray(game, [(Number(splited[1]) - 1)], 1);
		if(game == null){
			turno = PLAYER;
			ctx.answerCbQuery()
			return;
		}
		await updateGame(ctx, game, "Bot jogando...");
		await sleep(500);
		var jogada = MinMax.getJogada(game);
		win = MinMax.wintoria(jogada);
		updateGame(ctx, jogada, `Sua vez ${ctx.from.first_name}`)
		turno = PLAYER;
		if(win == 10){
			ctx.reply(`Parabens voce ganhou`);
		}else if (win == -10){
			ctx.reply(`Perdeu pro BOT kkkkk`);
		}else if(win == 0){
			ctx.reply(`Empate, que sem graça 😒`);
		}
		
		
	  	
	}
	//RESPONDE LOGO ISSO PRA N FICAR ESPERANDO LA O NEGOCINHO RODANDO
	ctx.answerCbQuery()//FK IMPORTANTE
	next()
})

bot.command('start', (ctx) => {

	ctx.reply(`Seja bem vindo ${ctx.from.first_name}.
Digite /comandos para ver os comandos disponiveis!`)

})
bot.command('comandos', (ctx) => {
	ctx.reply(`
Salve ${ctx.from.first_name} 👍:\n
♦ Digite /jogar para iniciar a partida
♦ /info para saber quem sou!!!

		`)

})

bot.command('info', (ctx) => {
	ctx.reply(`Eu sou um bot de para jogar Tic Tac Toe, infelizmente indisponivel em grupos!`)

})

bot.command('jogar',  async(ctx) =>{
	await ctx.reply(`Que começe os jogos!`)
	sendFirstGame(ctx, MinMax.getJogada([0,0,0,0,0,0,0,0,0]))
	turno = PLAYER;

})
async function updateGame(ctx, game, t){
	ctx.editMessageText(t, {
		reply_markup: Markup.inlineKeyboard([
	  	[{
	  		text: game[0],
	  		callback_data: `★!1`
	  	},
	    {
	  		text:game[1],
	  		callback_data: `★!2`
	  	},
	    {
	  		text:game[2],
	  		callback_data: `★!3`
	  	}],
	  	[{
	  		text:game[3],
	  		callback_data: `★!4`
	  	},
	    {
	  		text:game[4],
	  		callback_data: `★!5`
	  	},
	    {
	  		text:game[5],
	  		callback_data: `★!6`
	  	}],
	  	[{
	  		text:game[6],
	  		callback_data: `★!7`
	  	},
	    {
	  		text:game[7],
	  		callback_data: `★!8`
	  	},
	    {
	  		text:game[8],
	  		callback_data: `★!9`
	  	}]
	    
	])})
}

async function sendFirstGame(ctx, game){
	ctx.reply(`Sua vez ${ctx.from.first_name}`, {
		reply_markup: Markup.inlineKeyboard([
	  	[{
	  		text: game[0],
	  		callback_data: `★!1`
	  	},
	    {
	  		text:game[1],
	  		callback_data: `★!2`
	  	},
	    {
	  		text:game[2],
	  		callback_data: `★!3`
	  	}],
	  	[{
	  		text:game[3],
	  		callback_data: `★!4`
	  	},
	    {
	  		text:game[4],
	  		callback_data: `★!5`
	  	},
	    {
	  		text:game[5],
	  		callback_data: `★!6`
	  	}],
	  	[{
	  		text:game[6],
	  		callback_data: `★!7`
	  	},
	    {
	  		text:game[7],
	  		callback_data: `★!8`
	  	},
	    {
	  		text:game[8],
	  		callback_data: `★!9`
	  	}]
	    
	])})
}
bot.launch()
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}