import mongoose from "mongoose";
import { IUser } from "./User";

export enum StatusEnum {
  public,
  private,
}

export interface IStory {
  title: string;
  body: string;
  status?: StatusEnum;
  user?: string;
  createdAt: Date;
}

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model("Story", StorySchema);

export { Story };
