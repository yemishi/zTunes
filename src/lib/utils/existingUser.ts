import { db } from "../db";

type Response = {
  error: boolean;
  message?: String;
};
export const findByEmail = async (email: string): Promise<Response> => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        error: true,
        message: "User with this email already created.",
      };
    }
    return {
      error: false,
    };
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong, try again.",
    };
  }
};

export const findByName = async (username: string): Promise<Response> => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (existingUser) {
      return {
        error: true,
        message: "User with this name already created.",
      };
    }
    return {
      error: false,
    };
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong, try again.",
    };
  }
};
