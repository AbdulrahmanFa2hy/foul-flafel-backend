import { Router } from "express";
import authValidation from "./auth.validation";
import authService from "./auth.service";
import usersService from "../User/users.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../User/users.interface";


const authRouter : Router = Router();


authRouter.post('/signup',isAuthenticated([UserRoles.MANAGER, UserRoles.ADMIN], false),usersService.uploadImage,usersService.saveImage,authValidation.signup,authService.signup);
authRouter.post('/login',authValidation.login,authService.login);


export default authRouter;
