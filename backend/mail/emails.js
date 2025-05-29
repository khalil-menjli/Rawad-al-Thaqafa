import { transporter,sender } from "./email.cofig.js";



export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await transporter.sendMail({
			from: sender.email,
			to: email,
			subject: "Verify your email",
            html: `<b>Your verification code is: ${verificationToken}</b>`,
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await transporter.sendMail({
			from: sender.email,
			to: email,
			subject: "reset your Code",
            html: `<b>Your reset  code is: ${resetURL}</b>`,
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};