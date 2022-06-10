import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    answer: {type: String},
    date: Date,
    email: String,
    fromSite: {type: Boolean, default: false} 
});

export const Question = mongoose.model('Question', QuestionSchema);