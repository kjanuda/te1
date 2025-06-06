import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { sendEmail } from "./mail.utils.js";
const sender = { name: "Attendence System", address: process.env.MAIL_USER };

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipients = [{ name: "", address: email }];
	
	try {
		const response = await sendEmail({
            sender,
            recipients,
            subject: "Verify your email",
            message: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
          });

		  console.log("✅ Email sent successfully:", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ name, address: email }];

	try {
		const response = await  sendEmail({
			from: sender,
			to: recipients,
			template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
			template_variables: {
				company_info_name: "Auth Company",
				name: name,
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipients = [{ name: "", address: email }];

	try {
		await  sendEmail({
			sender,
			recipients,
			subject: "Reset your password",
			message: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipients = [{ address: email }];

	try {
		const response =  await sendEmail({
			sender,
			recipients,
			subject: "Password Reset Successful",
			message: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};