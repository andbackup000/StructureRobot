import { Trades } from "@prisma/client";
import { ICreateTradesRegistersDTO } from "../dtos/ICreateTradesRegistersDTO"

interface ITradesRepository { 
    create({ moment, orderId, priceUSD, quantity, side, symbol, timestamp}: ICreateTradesRegistersDTO): Promise<Trades>
    findBySide(side: string): Promise<Trades>;
    findBySymbol(symbol: string): Promise<Trades>;
    findByDate(date: string): Promise<Trades>;
    findById(id: string): Promise<Trades>;
}

export { ITradesRepository }