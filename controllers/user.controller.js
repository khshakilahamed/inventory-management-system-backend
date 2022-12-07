const { signupService, findUserByEmail } = require("../services/user.services");
const { sendMailWithMailGun } = require("../utils/email");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
    try {
        const user = await signupService(req.body);

        const mailData = {
            to: [user.email],
            subject: "Verify your Account",
            text: "Thank you",
        };

        sendMailWithMailGun(mailData);

        res.status(200).json({
            status: 'success',
            message: "successfully signed up"
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
            error,
        })
    }
}

/**
 * 1. check if email and password are given
 * 2. load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token

*/

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                status: "fail",
                error: "please provide your credentials",
            })
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: "fail",
                error: "No user found. Please create an account"
            });
        }

        const isPasswordValid = user.comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                status: "fail",
                error: "password is not correct"
            })
        }

        if (user.status != "active") {
            return res.status(401).json({
                status: "fail",
                error: "Your account is not active yet."
            });
        }

        const token = generateToken(user);


        // we don't can to share password
        const {password: pwd, ...others} = user.toObject();

        res.status(200).json({
            status: 'success',
            message: "successfully logged in",
            data: {
                others, 
                token
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
            error,
        })
    }
}

exports.getMe = async(req, res) => {
    try {
        // res.json(req.user);
        const user = await findUserByEmail(req.user?.email);

        res.status(200).json({
            status: "success",
            data: user
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
            error,
        })
    }
}