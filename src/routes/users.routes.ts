import { Router } from "express"
import { AuthenticateUserController } from "../modules/users/useCases/usersControllers/AuthenticateUserController";
import { CreateUserController } from "../modules/users/useCases/usersControllers/CreateUserController"
import { ensureAuthenticated } from "../shared/middleware/ensureAuthenticated";


const userRoutes = Router()

const createUser = new CreateUserController();
const authenticateUser = new AuthenticateUserController();

userRoutes.post("/", createUser.handle);
userRoutes.post("/session", authenticateUser.handle);



export { userRoutes };