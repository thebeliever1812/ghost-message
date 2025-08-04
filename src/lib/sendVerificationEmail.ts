import type { ApiResponse } from "../types/ApiResponse";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({service: "gmail", auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
},
});

export const sendVerificationEmail = async (to: string, otp: string): Promise<ApiResponse> => {
    try {
        const mailOptions = {
            from: `"GhostMessage" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Email Verification Code",
            html: `
            <div>
                <p>Hello,</p>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            </div>
            `,
        };
    
        await transporter.sendMail(mailOptions);
    
        return {
            success: true,  message: "Verification email sent successfully.",
        };
	} catch (error) {
		console.log('Error sending verification email:', error)
        return {
            success: false,
            message: "Failed to send verification email.",
        };
    }
};
