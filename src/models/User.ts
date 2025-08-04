import mongoose, { Schema, Document, mongo } from "mongoose";
import { Message } from "./Message";

export interface User extends Document {
	userName: string;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	salt: string;
	isAcceptingMessage: boolean;
	messages: Message[];
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema(
	{
		userName: {
			type: String,
			required: [true, "Username is required"],
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		verifyCode: {
			type: String,
			required: [true, "Verify code is required"],
		},
		verifyCodeExpiry: {
			type: Date,
			required: [true, "Verify code expiry is required"],
		},
		salt: {
			type: String,
		},
		isAcceptingMessage: {
			type: Boolean,
			default: true,
		},
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: "Message",
			},
		],
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);

export default UserModel;
