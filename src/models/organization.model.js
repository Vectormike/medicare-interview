const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const organizationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 11,
    },
    alternatePhoneNumber: {
      type: String,
      minlength: 11,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    nextOfKin: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeOrganization] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.isEmailTaken = async function (email, excludeorganizationId) {
  const organization = await this.findOne({ email, _id: { $ne: excludeorganizationId } });
  return !!organization;
};

/**
 * Check if password matches the organization's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
organizationSchema.methods.isPasswordMatch = async function (password) {
  const organization = this;
  return bcrypt.compare(password, organization.password);
};

organizationSchema.pre('save', async function (next) {
  const organization = this;
  if (organization.isModified('password')) {
    organization.password = await bcrypt.hash(organization.password, 8);
  }
  next();
});

/**
 * @typedef Organization
 */
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
