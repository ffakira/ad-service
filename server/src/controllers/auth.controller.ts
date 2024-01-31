import { Request, Response } from "express";
import { constants as c } from "node:http2";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { User, UserSchemaZod } from "../models/user.model";
import UserRepository from "../repositories/user.repository";

export default class AuthController {
  private static userRepository = new UserRepository();

  static async getAllUsers(req: Request, res: Response) {
    try {
      const getRowCountUsers =
        await AuthController.userRepository.getRowCountUsers();
      console.log(getRowCountUsers);
      return res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: {
          totalUsers: getRowCountUsers,
        },
      });
    } catch (err) {
      console.error("[AuthController@all]:", (err as Error).message);
      return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
        status: c.HTTP_STATUS_BAD_REQUEST,
        error: {
          message: (err as Error).message,
        },
      });
    }
  }

  static session(req: Request, res: Response) {
    //@ts-ignore
    if (!req.session["isAuth"]) {
      return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
        status: c.HTTP_STATUS_UNAUTHORIZED,
        error: {
          message: "No sessions found",
        },
      });
    } else {
      return res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: {
          //@ts-ignore
          isAdmin: req.session["isAdmin"],
          //@ts-ignore
          username: req.session["userId"],
          //@ts-ignore
          isAuth: req.session["isAuth"],
        },
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validateSchema = UserSchemaZod.parse(req.body);
      const user = validateSchema as User;
      const getUsername = await AuthController.userRepository.getUserByUsername(
        user.username.toLowerCase().trim()
      );

      if (getUsername === null) {
        return res.status(c.HTTP_STATUS_NO_CONTENT).json({
          status: c.HTTP_STATUS_NO_CONTENT,
          error: {
            message: "Username does not exist",
          },
        });
      } else {
        const comparePassword = await bcrypt.compare(
          user.password,
          getUsername.password!
        );
        if (comparePassword) {
          //@ts-ignore
          req.session["isAdmin"] = getUsername.isAdmin ?? false;
          //@ts-ignore
          req.session["userId"] = getUsername.username ?? "";
          //@ts-ignore
          req.session["isAuth"] = true;

          return res.status(c.HTTP_STATUS_OK).json({
            status: c.HTTP_STATUS_OK,
            data: {
              isAdmin: getUsername.isAdmin,
              username: getUsername.username,
            },
          });
        } else {
          return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
            status: c.HTTP_STATUS_UNAUTHORIZED,
            error: {
              message: "Invalid password",
            },
          });
        }
      }
    } catch (err) {
      console.error("[AuthController@login]:", (err as Error).message);
      if (err instanceof ZodError) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: err.errors,
          },
        });
      } else {
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          error: {
            message: (err as Error).message,
          },
        });
      }
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const validateSchema = UserSchemaZod.parse(req.body);
      const user = validateSchema as User;
      const createUser = await AuthController.userRepository.createUser(user);

      if (!createUser) {
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          error: {
            message: "Failed to create a new user",
          },
        });
      } else {
        return res.status(c.HTTP_STATUS_CREATED).json({
          status: c.HTTP_STATUS_CREATED,
          data: {
            username: createUser.username,
          },
        });
      }
    } catch (err) {
      const ERR_DUPLICATE_KEY = "E11000 duplicate key error collection";
      if ((err as Error).message.includes(ERR_DUPLICATE_KEY)) {
        return res.status(c.HTTP_STATUS_CONFLICT).json({
          status: c.HTTP_STATUS_CONFLICT,
          error: {
            message: "This username already exists",
          },
        });
      }
      if (err instanceof ZodError) {
        console.error("[AuthController@register]:", (err as Error).message);
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: err.errors,
          },
        });
      } else {
        console.error("[AuthController@register]:", (err as Error).message);
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          error: {
            message: (err as Error).message,
          },
        });
      }
    }
  }

  static logout(req: Request, res: Response) {
    //@ts-ignore
    req.session.destroy();

    return res.status(c.HTTP_STATUS_OK).json({
      data: {
        logout: true,
      },
    });
  }
}
