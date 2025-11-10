const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const paymentSchema = new mongoose.Schema({
  receiptNo: { type: String},
  amount: Number,
  date: { type: Date, default: Date.now },
  paymentDate: { type: Date, default: Date.now }, // manual entry
  collectedBy: String,
  paymentMode: String,
  notes: String
});

const attendanceSchema = new mongoose.Schema({
  month: String,
  daysPresent: Number,
  totalDays: Number
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true }, // ✅ unique key
  name: { type: String, required: true },
  fatherName: String,
  dateOfBirth: Date,
  gender: String,
  email: String, // ✅ keep optional (not unique)
  phone: String,
  parentPhone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  aadhaarNumber: String,
  batchTime: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  joinDate: { type: Date, default: Date.now },
  registrationDate: { type: Date, default: Date.now },
  courseDuration: String,
  totalFees: Number,
  paidFees: { type: Number, default: 0 },
  paymentPlan: { type: String, default: 'Full Payment' },
  referredBy: String,
  admissionTakenBy: String,
  status: { type: String, default: 'Active' },
  notes: String,
  photo: String, // 🖼️ optional photo upload field
  password: { type: String, required: true },
  payments: {
    type: [paymentSchema],
    default: []
  },
  attendance: [attendanceSchema]
});

// 🔐 Hash password before saving
studentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
