import mongoose from "mongoose";

const KeywordSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

export const Keyword = mongoose.model('Keywords', KeywordSchema);