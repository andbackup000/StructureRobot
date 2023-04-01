import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { UserRepository } from "../../modules/users/repositories/implametations/UserRepository";


interface IPayload {
    sub: string;
}

export function ensureAuthenticated(
    request: Request,
    resposnse: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return resposnse.status(401).json({
            errorCode: "token invalid",
        });
    }

    const [,token ] = authToken.split(" ")

    const { sub: user_id } = verify(token, process.env.JWT_SECRET) as IPayload

    const userRepository = new UserRepository();

    const user = userRepository.findById(user_id);

    if(!user){
        throw new AppError("Token invalid!", 401);
    }

    request.user = {
        id: user_id,
    }

    next();
}