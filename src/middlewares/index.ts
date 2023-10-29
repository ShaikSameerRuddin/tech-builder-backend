import { errorHandlerMiddleware } from "./errorHandlerMiddleware ";
import { notFoundMiddleware } from "./notFoundMiddleware ";
import { authenticationCheck, checkDuplicatePhoneOrEmail } from "./auth.middleware";


export {
  errorHandlerMiddleware,
  notFoundMiddleware,
  checkDuplicatePhoneOrEmail,
  authenticationCheck,
};
