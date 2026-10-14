import mongoose, { Schema } from "mongoose";

// One file for all internal staff collections to keep the ops backend compact.

const HousekeepingSchema = new Schema(
  {
    room: { type: String, required: true },
    state: { type: String, enum: ["Ready", "Cleaning", "Inspection", "Out of order"], default: "Inspection" },
    note: { type: String, default: "" },
    photoUrl: { type: String },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const ShiftSchema = new Schema(
  {
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    role: { type: String, required: true },
    staffName: { type: String, required: true },
    shift: { type: String, default: "" }, // e.g. 06:00–14:00
  },
  { timestamps: true }
);

const LeaveSchema = new Schema(
  {
    staffName: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending", index: true },
  },
  { timestamps: true }
);

const ClockSchema = new Schema(
  {
    staffName: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    clockIn: { type: String, default: "" },
    clockOut: { type: String, default: "" },
  },
  { timestamps: true }
);
ClockSchema.index({ staffName: 1, date: 1 }, { unique: true });

const MaintenanceSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, default: "" },
    priority: { type: String, enum: ["urgent", "routine", "low"], default: "routine", index: true },
    status: { type: String, enum: ["open", "in_progress", "done"], default: "open", index: true },
    detail: { type: String, default: "" },
    photoUrl: { type: String },
    assignedTo: { type: String, default: "" },
  },
  { timestamps: true }
);

const MessageSchema = new Schema(
  {
    reference: { type: String, required: true, index: true },
    from: { type: String, enum: ["guest", "staff"], required: true },
    name: { type: String, default: "" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);
MessageSchema.index({ reference: 1, createdAt: 1 });

const IncidentSchema = new Schema(
  {
    type: { type: String, enum: ["complaint", "incident", "lost", "found"], required: true, index: true },
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    reference: { type: String, default: "" }, // linked booking, if any
    photoUrl: { type: String },
    status: { type: String, enum: ["open", "resolved"], default: "open", index: true },
    reportedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const DishSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number },
    category: {
      type: String,
      enum: ["Breakfast", "Mains", "Dessert", "Function", "Special"],
      default: "Mains",
      index: true,
    },
    photoUrl: { type: String },
    photoPublicId: { type: String },
    available: { type: Boolean, default: true, index: true },
    postedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    coverUrl: { type: String },
    coverPublicId: { type: String },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: String },
  },
  { timestamps: true }
);

export const HousekeepingModel = mongoose.models.NHHousekeeping ?? mongoose.model("NHHousekeeping", HousekeepingSchema);
export const ShiftModel = mongoose.models.NHShift ?? mongoose.model("NHShift", ShiftSchema);
export const LeaveModel = mongoose.models.NHLeave ?? mongoose.model("NHLeave", LeaveSchema);
export const ClockModel = mongoose.models.NHClock ?? mongoose.model("NHClock", ClockSchema);
export const MaintenanceModel =
  mongoose.models.NHMaintenance ?? mongoose.model("NHMaintenance", MaintenanceSchema);
export const MessageModel = mongoose.models.NHMessage ?? mongoose.model("NHMessage", MessageSchema);
export const IncidentModel = mongoose.models.NHIncident ?? mongoose.model("NHIncident", IncidentSchema);
export const DishModel = mongoose.models.NHDish ?? mongoose.model("NHDish", DishSchema);
export const PostModel = mongoose.models.NHPost ?? mongoose.model("NHPost", PostSchema);
