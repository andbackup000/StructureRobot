import { compare } from "bcrypt";
import "dotenv"
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../errors/AppError";
import { IUsersRepository } from "../repositories/IUsersRepository";

interface IUserResponse {  
    user:{
        name: string,
        email: string,
    },
    token: string,
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UserRepository") 
        private usersRepository: IUsersRepository
    ){}
    async execute(email: string, password:string) {
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError("Email or password is incorrect!", 404);
        }

        const isPasswordCorrect = await compare(password, user.password);

        if(!isPasswordCorrect){
            throw new AppError("Email or password is incorrect!", 404);
        }


        const JWT_SECRET = process.env.JWT_SECRET;

        const token = sign( 
            {}, 
            JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        )

        const TokenResponse: IUserResponse={
            user:{
                name: user.name,
                email: user.email
            },
            token
        }

        return { TokenResponse };
    
    }
}

export { AuthenticateUserUseCase }