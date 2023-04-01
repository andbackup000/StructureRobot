import { Router } from "express"
import { tradeRoutes } from "./trades.routes";
import { userRoutes } from "./users.routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/trades", tradeRoutes);

export { routes }
