// models/account.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema } = mongoose;

// Base options for all account types\
  const baseOptions = {
  discriminatorKey: 'role',      
  collection: 'accounts',        
  timestamps: true,              
};

// Common schema for all accounts
const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  resetPasswordToken:      { type: String, select: false },
  resetPasswordExpiresAt:  { type: Date,   select: false },
  verificationToken:       { type: String, select: false },
  verificationTokenExpiresAt: { type: Date, select: false },
}, baseOptions);

// Hash password before saving
AccountSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
AccountSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Static method: find all accounts
AccountSchema.statics.findAllAccounts = function() {
  return this.find({}).lean();
};

// Static method: find by roles array
AccountSchema.statics.findByRoles = function(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return this.find({}).lean();
  }
  return this.find({ role: { $in: roles } }).lean();
};

// Base model
const Account = mongoose.model('Account', AccountSchema);

// Discriminators for specific roles
const Admin = Account.discriminator(
  'Admin',
  new Schema({}, { _id: false })
);

const User = Account.discriminator(
  'User',
  new Schema({
    points: { type: Number, required: true, trim: true },

  }, { _id: false })
);

const Partner = Account.discriminator(
  'Partner',
  new Schema({
    businessName: { type: String, required: true, trim: true },
    description:  { type: String, required: true, trim: true },
    location:     { type: String, required: true, trim: true },
    websiteUrl:   { type: String, required: true, trim: true },
    categories:   [{ type: String, enum: ['Books','Museums','Library','Cinema'] }],
    imageUrl:     { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },

  }, { _id: false })
);

 export default { Account, Admin, User, Partner };
