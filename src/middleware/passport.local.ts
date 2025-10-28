import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { handleLogin } from "services/client/auth.service";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy(function verify(username, password, callback) {
      console.log(">>> check username/password: ", username, password);
      return handleLogin(username, password, callback);
    }),
  );
};

export default configPassportLocal;
