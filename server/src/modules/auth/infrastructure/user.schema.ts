import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  workspaceId: mongoose.Types.ObjectId | null;
  status: string;
  avatarUrl: string | null;
  refreshTokens: string[];
  passwordResetToken: string;
  passwordResetExpires: Date | null;
  isOnline: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "workspaceadmin", "moderator", "member"],
      default: "member",
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    avatarUrl: { type: String, default: null },
    refreshTokens: [{ type: String }],
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
    lastSeenAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);



export const UserModel=mongoose.model<IUserDocument>('User',UserSchema)