import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;

    const user = await authServices.findUser({ email });

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.signup({
        ...req.body,
        password: hashPassword,
        token,
    });

    const payload = { email: newUser.email, id: newUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });

    await authServices.updateUser({ _id: newUser._id }, { token });

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            email: newUser.email,
        },
    });
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    const user = await authServices.findUser({ email });

    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const { _id: id } = user;

    const payload = {
        id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });

    await authServices.updateUser({ _id: id }, { token });

    res.status(200).json({
        token,
        user: {
            name: user.name,
            email: user.email,
        },
    });
};

const current = async (req, res) => {
    const { name, email } = req.user;

    res.status(200).json({
        user: {
            name,
            email,
        },
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;

    await authServices.updateUser({ _id }, { token: "" });

    res.status(204).json({
        message: "Signout success",
    });
};

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
};
