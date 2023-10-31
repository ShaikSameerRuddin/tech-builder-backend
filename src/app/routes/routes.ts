import { Request, Response, Express } from "express";
import {
  healthCheckUrl,
  logOutUrl,
  loginUrl,
  registerUrl,
  userUpdateUrl,
} from "./urls";
import { authController } from "../controllers";
import {
  checkDuplicatePhoneOrEmail,
  authenticationCheck,
} from "../../middlewares";

export const routes = (app: Express, express: any) => {
  const router = express.Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get(healthCheckUrl, (req: Request, res: Response) => {
    res.send("Hello, boss!");
  });

  //auth
  app.post(registerUrl, [checkDuplicatePhoneOrEmail], authController.register);
  app.post(loginUrl, authController.login);
  app.patch(userUpdateUrl, [authenticationCheck], authController.updateUser);
  app.get(logOutUrl, [authenticationCheck], authController.logout);
};
