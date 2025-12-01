const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const response = require("../utils/response");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return response.error(res, "User already exists", 400);
        }

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashed,
            role: "user"  // default role
        });

        return response.success(res, "Registered Successfully");

    } catch (err) {
        return response.error(res, err.message, 500);
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return response.error(res, "User not found", 404);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return response.error(res, "Invalid Credentials", 401);
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );


        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return response.success(res, "Login success", { token, user: userData });

    } catch (err) {
        return response.error(res, err.message, 500);
    }
};
