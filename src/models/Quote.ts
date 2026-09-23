import mongoose, { Schema, type InferSchemaType } from "mongoose";

const LineSchema = new Schema(
  { label: { type: String, required: true }, amount: { type: Number, required: true, min: 0 } },
  { _id: false }
);

const QuoteSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    kind: { type: String, enum: ["stay", "venue"], required: true, index: true },
    title: { type: String, required: true },
    room: { type: String },
    venue: { type: String },
    roomSlug: { type: String, index: true },
    venueSlug: { type: String, index: true },
    nights: { type: Number },
    days: { type: Number },
    checkIn: { type: String },
    checkOut: { type: String },
    eventDate: { type: String },
    lines: { type: [LineSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    depositDue: { type: Number, required: true, min: 0 },
    input: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["quoted", "proof_received", "confirmed", "cancelled"],
      default: "quoted",
      index: true,
    },
    proofUrl: { type: String },
    proofPublicId: { type: String },
  },
  { timestamps: true }
);

QuoteSchema.index({ createdAt: -1 });
QuoteSchema.index({ roomSlug: 1, checkIn: 1, checkOut: 1, status: 1 });
QuoteSchema.index({ venueSlug: 1, eventDate: 1, status: 1 });

export type QuoteDoc = InferSchemaType<typeof QuoteSchema>;

export const QuoteModel =
  mongoose.models.NHQuote ?? mongoose.model("NHQuote", QuoteSchema);
