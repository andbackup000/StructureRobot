import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTradesUseCase } from "../CreateTradeUseCase";


export class CreateTradesController {
  async handle(request: Request, response: Response) {
    const { moment, orderId, priceUSD, quantity, side, symbol, timestamp } = request.body;

    const createTradesUseCase = container.resolve(CreateTradesUseCase);
    const trade = await createTradesUseCase.execute({
      moment,
      orderId,
      priceUSD,
      quantity,
      side,
      symbol,
      timestamp,
    });

    return response.status(201).json(trade);
  }
}