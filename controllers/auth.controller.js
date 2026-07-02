import { AuthModel } from "../models/auth.model.js";
import { validateRegister, validateLogin } from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class AuthController {
  static register = async (req, res) => {
    try {
      const { data, error } = validateRegister(req.body);

      if (error)
        return res.status(400).json({ message: JSON.parse(error.message) });

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userToSave = {
        ...data,
        password: hashedPassword,
      };

      const userCreated = await AuthModel.register({ data: userToSave });

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: userCreated._id,
          username: userCreated.username,
          email: userCreated.email,
        },
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  static login = async (req, res) => {
    try {
      const { data, error } = validateLogin(req.body);

      if (error)
        return res.status(400).json({ message: JSON.parse(error.message) });

      const user = await AuthModel.login({ data });

      const isPasswordValid = user
        ? await bcrypt.compare(data.password, user.password)
        : false;

      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid email or password" });

      if (!user)
        return res.status(401).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
