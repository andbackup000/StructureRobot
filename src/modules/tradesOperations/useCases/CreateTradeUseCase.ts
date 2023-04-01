import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../errors/AppError";
import { ICreateTradesRegistersDTO } from "../dtos/ICreateTradesRegistersDTO";
import { ITradesRepository } from "../repositories/ITradesRepository";


@injectable()
class CreateTradesUseCase{
    constructor(
        @inject("TradesRepository") 
        private tradesRepository: ITradesRepository
    ){}

    async execute({ moment, orderId, priceUSD, quantity, side, symbol, timestamp }: ICreateTradesRegistersDTO){

        const trade = await this.tradesRepository.create({
            moment,
            orderId,
            priceUSD,
            quantity,
            side,
            symbol,
            timestamp
        });

        return trade;

    }


}

export { CreateTradesUseCase }