import users from "../db/users.js";
import bcrypt from "bcrypt";

export class AuthModel {
  static register = async ({ data }) => {
    const { email } = data;

    const userFound = await users.findOne({ email });
    if (userFound) return null;

    const userCreated = await users.create(data);
    return userCreated;
  };

  static login = async ({ email, password }) => {
    const userFinded = await users.findOne({ email });

    if (!userFinded) return null;

    return userFinded;
  };
}
