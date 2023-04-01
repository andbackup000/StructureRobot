var ccxt = require('ccxt');
var config = require('./config');
var ta = require('ta.js')
const axios = require('axios');

async function pullBack() {
     
    console.log('');

    /* SYSTEM */
    var exchange = new ccxt.kucoin({
        'apiKey': config.API_KEY,
        'secret': config.SECRET_KEY,
        'password': config.PASSWORD,
        'uid': config.UID
    });

    let comprado = false;
    const url = 'https://4003-andbackup00-structurero-05wknpzgqgo.ws-eu93.gitpod.io/trades'
    const findTrade = await axios.get(`${url}/side`)


    /* DADOS */
    const mercado = await exchange.load_markets();
    const data = (await exchange.fetchOHLCV(config.SYMBOL, '15m'));


    /* ACESSANDO CANDLES OHLC BCHBEAR/USD */
    const open = (data.map(candleO => (candleO[1]))).reverse();
    const high = (data.map(candleH => (candleH[2]))).reverse();
    const low = (data.map(candleL => (candleL[3]))).reverse();
    const close = (data.map(candleC => (candleC[4]))).reverse();

    /* MÉDIAS DE MÓVEIS */
    const fastMedian = await ta.sma(low, 88);
    const slowMedian = await ta.sma(high, 100);
    const threeMedian = await ta.sma(high, 3);

    /* CONVERÇÃO DE MOEDAS */
    const saldo = await exchange.fetchBalance();
    const USDTTotal = saldo.total['USDT'];
    const USDTFree = saldo.free['USDT'];
    const ADA3LTotal = saldo.total['ADA3L'];
    const BTCtotal = saldo.total['BTC'];
    const amountUSDT = (0.6/close[0])

    /* CRIAÇÃO DE PROFITS */

    const trades = (await exchange.fetchMyTrades('ADA3L/USDT')).reverse();
    let ultimate;
    try {
        ultimate = findTrade.data.filter(trade => trade.symbol === 'ADA3L/USDT')
    } catch (error) {
        console.error("Um erro ocorreu na consulta do symbol", error);
    }

    let point;
    try {
        point = ultimate.filter(findTrade => findTrade.side === "buy")
    } catch (error) {
        console.error("Um erro ocorreu na consulta do side de compra", error);        
    }

    let findSell;
    try {
        findSell = ultimate.filter(findTrade => findTrade.side === "sell");
    } catch (error) {
        console.error("Um erro ocorreu na consulta do side de venda", error);                
    }

    let sellPoint;
    try {
        sellPoint = findSell.reduce((prev, current) => {
            return prev.create_at > current.create_at ? prev : current;
        });
    } catch (error) {
        console.error("Um erro ocorreu na consulta dos dados do banco", error);
    }

    
    const groundZero = sellPoint.timestamp
    const amount = point.filter(trades => trades.timestamp > groundZero)
    const setPrice = amount.map(amount => parseFloat(amount.priceUSD))
    const n = setPrice.length;
    let sum = 0;
    
    for (var i = 0; i < setPrice.length; i++) {
        sum += setPrice[i];
    }

    const medianPrice = sum / n

    const Profit = (medianPrice * 1.025);
    
    const dbBoryTrade = {
        orderId: sellPoint.orderId,
        symbol: sellPoint.symbol,
        side: sellPoint.side,
        quantity: parseFloat(sellPoint.quantity),
        priceUSD: parseFloat(sellPoint.priceUSD),
        timestamp: parseFloat(sellPoint.timestamp),
        moment: sellPoint.moment,
    }

    const bodyTrade = {
        orderId: trades[0].order,
        symbol: trades[0].symbol,
        side: trades[0].side,
        quantity: trades[0].amount,
        priceUSD: trades[0].price,
        timestamp: trades[0].timestamp,
        moment: trades[0].datetime,
    }

    /* CRUZAMENTO DE MEDIAS */
    const crossover = (fastMedian[1] > slowMedian[1] && fastMedian[2] < slowMedian[2]);
    const crossunder = (fastMedian[1] < slowMedian[1] && fastMedian[2] > slowMedian[2]);

    /* MOMENTO DO TRADE */
    const timer = (1000 * 60 * 15);
    const tstamp = (ultimate[0].timestamp)+timer;
    const current = (data.map(candle => (candle[0]))).reverse();
    const currentCandle = current[0]

    /* REGISTRO DE MAREGM LIVRE */
    const lado = ultimate[0].side;
    const ativo = ultimate[0].symbol;

    if (lado === "buy" && ativo === 'ADA3L/USDT' && (0.999999 < (ADA3LTotal * close[0]))) {
        comprado = true;
        console.log(`Comprado em ${config.SYMBOL} no preço ${medianPrice} ` );
        console.log(`Profit em ${Profit}`);

    } else {
        console.log(`Última venda em ${sellPoint.priceUSD} no tempo ${groundZero}`);
    }

    /* ESTATÉGIAS , CONDIÇÕES E ORDENS  */
    try {
        if (currentCandle>tstamp && close[3] < open[3] && close[2] < open[2] && close[1] > open[1] && ((close[1] - open[1]) > (open[1] - low[1]))) {
            console.log("Compra ADA3L")
            var buy = exchange.createMarketBuyOrder('ADA3L/USDT', amountUSDT);
            console.log("Registro da compra no Banco de Dados")
        }
    } catch (error) {
        console.error("Um erro ocorreu na compra do ativo", error);
    } 

    try {
        if (comprado && ((close[0] >= Profit) && ativo === 'ADA3L/USDT' && lado === 'buy')) {
            console.log("Fechamento do trade")
            var sell = exchange.createMarketSellOrder('ADA3L/USDT', ADA3LTotal);
            console.log("Registro da venda no Banco de Dados")
        }
    } catch (error) {
        console.error("Um erro ocorreu na compra do ativo", error);
    } 

    let review = findTrade.data.map(findTrade => findTrade.orderId === bodyTrade.orderId)
    
    try {
        if (bodyTrade && !review && bodyTrade.symbol === 'ADA3L/USDT') {
            axios.post(url,  bodyTrade );
          console.log('trade executado e registrado no banco de dados')
        }
    } catch (error) {
        console.error("Um erro ocorreu no resgistro de dados", error);
    } 

    console.log('')
    console.log("O total de Money na conta é $", USDTTotal+(ADA3LTotal*close[0]), "Dólares")
    
}

pullBack();

setInterval(pullBack, config.CRAWLER_INTERVAL);

module.exports =  { pullBack } ;