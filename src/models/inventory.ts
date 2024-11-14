// models/inventory.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  projectId: mongoose.Types.ObjectId;
  itemName: string;
  quantity: number;
  unit: string;
  lastUpdated: Date;
}

const inventorySchema: Schema = new Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>("Inventory", inventorySchema);
