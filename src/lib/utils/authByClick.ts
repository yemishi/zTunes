import { UserToken } from "../auth";
import { db } from "../db";

export const authByClick = async ({
  profile,
}: {
  profile: UserToken;
}): Promise<UserToken> => {
  const { email, name, picture } = profile;

  const existingUser = await db.user.findFirst({
    where: {
      email: email as string,
      username: name as string,
    },
  });
  if (existingUser) {
    return {
      email: existingUser.email,
      name: existingUser.username,
      picture: existingUser.profile?.avatar as string,
      isAdmin: !!existingUser.isAdmin,
    };
  }
  const pictureUrl =
    typeof picture === "string"
      ? picture
      : "https://i.pinimg.com/564x/a6/aa/5d/a6aa5d80551d471078f799e1473c20fb.jpg";

  const newUser = await db.user.create({
    data: {
      email: email as string,
      username: name as string,
      profile: {
        avatar: pictureUrl as string,
        birthDate: "",
      },
      isVerified: true,
    },
  });

  return {
    email: newUser.email,
    name: newUser.username,
    picture: newUser.profile?.avatar as string,
    isAdmin: false,
  };
};
