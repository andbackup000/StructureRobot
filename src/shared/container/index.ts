import { container } from "tsyringe";
import { TradesRepository } from "../../modules/tradesOperations/repositories/implametations/TradesRepository";
import { ITradesRepository } from "../../modules/tradesOperations/repositories/ITradesRepository";
import { UserRepository } from "../../modules/users/repositories/implametations/UserRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
    "UserRepository",
    UserRepository
)

container.registerSingleton<ITradesRepository>(
    "TradesRepository",
    TradesRepository
)
