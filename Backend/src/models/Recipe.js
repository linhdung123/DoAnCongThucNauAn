import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    ingredients: { type: [ingredientSchema], default: [] },
    instructions: { type: [String], default: [] },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
