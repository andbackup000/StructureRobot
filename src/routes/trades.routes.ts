import { Router } from "express"
import { CreateTradesUseCase } from "../modules/tradesOperations/useCases/CreateTradeUseCase";
import { CreateTradesController } from "../modules/tradesOperations/useCases/tradesControllers/CreateTradeController";
import { AuthenticateUserController } from "../modules/users/useCases/usersControllers/AuthenticateUserController";
import { CreateUserController } from "../modules/users/useCases/usersControllers/CreateUserController"
import { ensureAuthenticated } from "../shared/middleware/ensureAuthenticated";
import { FindSideTradesController } from "../modules/tradesOperations/useCases/tradesControllers/FindSideTradeController";


const tradeRoutes = Router()

const createtrade = new CreateTradesController();
const findSideTrade = new FindSideTradesController();

tradeRoutes.post("/", createtrade.handle);
tradeRoutes.get("/side", findSideTrade.handle);


export { tradeRoutes, findSideTrade };