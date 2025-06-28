import Jwt from "jsonwebtoken";

class CreateTokens {
  accessToken = (id: any, role: string): string => {
    return Jwt.sign(
      { _id: id, role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE || "1d" } as any
    );
  };

  resetToken = (id: any): string => {
    return Jwt.sign(
      { _id: id },
      process.env.JWT_SECRET_RESET as string,
      { expiresIn: process.env.JWT_EXPIRE_RESET || "15m" } as any
    );
  };
}

const createTokens = new CreateTokens();
export default createTokens;
