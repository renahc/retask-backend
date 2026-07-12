import { AuthModel } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class AuthController {
  static register = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userToSave = {
        username,
        email,
        password: hashedPassword,
      };

      const userCreated = await AuthModel.register({ data: userToSave });

      if (!userCreated)
        return res.status(400).json(["The email already exists"]);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: userCreated._id,
          username: userCreated.username,
          email: userCreated.email,
        },
      });
    } catch (e) {
      res.status(500).json([e.message]);
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await AuthModel.login({ email, password });
      console.log(user);
      const isPasswordValid = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (!isPasswordValid)
        return res.status(401).json(["Invalid email or password"]);

      if (!user) return res.status(401).json(["Invalid email or password"]);

      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
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
    } catch (e) {
      res.status(500).json([e.message]);
    }
  };

  static me = (req, res) => {
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  };
}
