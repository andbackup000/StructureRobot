import { Trades } from "@prisma/client";
import { prismaClient } from "../../../../database/prismaClient";
import { AppError } from "../../../../errors/AppError";
import { ICreateTradesRegistersDTO } from "../../dtos/ICreateTradesRegistersDTO";
import { ITradesRepository } from "../ITradesRepository";

class TradesRepository implements ITradesRepository{
    async create({ moment, orderId, priceUSD, quantity, side, symbol, timestamp }: ICreateTradesRegistersDTO): Promise<Trades> {
        const trade = await prismaClient.trades.create({
            data: {
                orderId,
                symbol,
                side,
                quantity,
                priceUSD,
                timestamp,
                moment 
            }
        })
        return trade as Trades;
    }

    async findByDate(moment: string): Promise<Trades> {
        const tradeDate = await prismaClient.trades.findMany({
            where: {
                moment,
            },
        });
    
        return tradeDate as unknown as Trades; 
    }

    async findBySide(side: string): Promise<Trades> {
        const tradeSide = await prismaClient.trades.findMany({
            where: {
                side,
            }  
        });

        
        return tradeSide as unknown as Trades;
    }

    async findBySymbol(symbol: string): Promise<Trades> {
        const tradeSymbol = await prismaClient.trades.findMany({
            where: {
                symbol,
            },
        });
    
        return tradeSymbol as unknown as Trades;
    }

    async findById(id: string): Promise<Trades> {
        const identification = await prismaClient.trades.findUnique({
            where: {
                id,
            },
        });
    
        return identification;
    }
}

export { TradesRepository }