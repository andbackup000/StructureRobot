import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../errors/AppError";
import { ICreateTradesRegistersDTO } from "../dtos/ICreateTradesRegistersDTO";
import { ITradesRepository } from "../repositories/ITradesRepository";


@injectable()
class FindSideTradesUseCase{
    constructor(
        @inject("TradesRepository") 
        private tradesRepository: ITradesRepository
    ){}

    async execute(side : string){
        const findtrade = await this.tradesRepository.findBySide(
            side,
        );

        return findtrade;
    }
}

export { FindSideTradesUseCase }