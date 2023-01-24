import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";
import User from "../modules/User";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    /* This code uses the bcrypt library to generate a salt and then hash the user's provided password using that salt. The generated salt is unique for every password and it is used to add an additional layer of security to the hashed password. The hashed password is then stored in the passwordHash variable. This process will make it much more difficult for someone to determine the original plaintext password even if they were to gain access to the hashed version. */

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const saveUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {}
};
