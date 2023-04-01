import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindSideTradesUseCase } from "../FindSideTradesUseCase";


export class FindSideTradesController {
  async handle(request: Request, response: Response) {
    const { side }  = request.params;

    const findSideTradesUseCase = container.resolve(FindSideTradesUseCase);
    const findtrade = await findSideTradesUseCase.execute(
      side,
    );

    return response.status(200).json(findtrade);
  }
}