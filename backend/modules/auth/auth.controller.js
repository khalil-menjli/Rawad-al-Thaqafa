// controllers/authController.js
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../..//mail/emails.js';
import  models from '../../model/account.model.js';
import { log } from 'console';

const { Account, Partner} = models;


export const signup = async (req, res, next) => {
  try {
    const {
      email, password, firstName, lastName, role,
      businessName, description, location, websiteUrl, categories
    } = req.body;
    const file = req.file;

    // Basic validation
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }

    // Check duplicate email
    if (await Account.findOne({ email })) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiresAt = Date.now() + 24*60*60*1000;

    let account;
    if (role.toLowerCase() === 'partner') {
      // Partner-specific validation
      if (!businessName || !description || !location || !websiteUrl || !categories || !file) {
        console.log(businessName , description, location, websiteUrl, categories , file );
        
        return res.status(400).json({ message: 'All partner fields and an image are required.' });
      }
      // Build image URL for static serving
      const imageUrl = `/uploads/${file.filename}`;

      account = new Partner({
        email, password, firstName, lastName,
        businessName, description, location, websiteUrl,
        categories: Array.isArray(categories) ? categories : [categories],
        imageUrl,
        verificationToken, verificationTokenExpiresAt
      });
    } else {
      // Handle User/Admin similarly (omitted for brevity)
      account = new Account({ email, password, firstName, lastName, role, verificationToken, verificationTokenExpiresAt });
    }

    await account.save();

    // Set JWT cookie and send email
    const token = generateTokenAndSetCookie(res, account._id);
    await sendVerificationEmail(email, verificationToken);

    const safeAccount = account.toObject();
    delete safeAccount.password;
    delete safeAccount.resetPasswordToken;
    delete safeAccount.resetPasswordExpiresAt;
    delete safeAccount.verificationToken;
    delete safeAccount.verificationTokenExpiresAt;

    res.status(201).json({ success: true, token, message: 'Signup successful', account: safeAccount });
  } catch (err) {
    next(err);
  }
};

// Verify email with code
export const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    const account = await Account.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });
    if (!account) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    account.isApproved = true;
    account.verificationToken = undefined;
    account.verificationTokenExpiresAt = undefined;
    await account.save();

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
};

// Login: authenticate and set cookie
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const account = await Account.findOne({ email }).select('+password');
    if (!account) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatch = await account.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateTokenAndSetCookie(res, account._id);
    const safeAccount = account.toObject();
    delete safeAccount.password;

    res.status(200).json({ success: true, message: 'Login successful', token, account: safeAccount });
  } catch (err) {
    next(err);
  }
};

// Logout: clear JWT cookie
export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// Forgot password: send reset link
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    account.resetPasswordToken = resetToken;
    account.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await account.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(account.email, resetUrl);

    res.status(200).json({ success: true, message: 'Password reset email sent.' });
  } catch (err) {
    next(err);
  }
};

// Reset password: validate token and set new password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const account = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    }).select('+password');
    if (!account) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    account.password = password; // will be hashed via pre-save hook
    account.resetPasswordToken = undefined;
    account.resetPasswordExpiresAt = undefined;
    await account.save();

    res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    next(err);
  }
};

// Check auth: return account data
export const checkAuth = async (req, res, next) => {
  try {
    const account = await Account.findById(req.userId).select('-password');
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }
    res.status(200).json({ success: true, account });
  } catch (err) {
    next(err);
  }
};

// Update profile: name and/or password
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, currentPassword, newPassword } = req.body;
    const account = await Account.findById(req.userId).select('+password');
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    if (firstName) account.firstName = firstName;
    if (lastName) account.lastName = lastName;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' });
      }
      const isMatch = await account.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }
      account.password = newPassword;
    }

    await account.save();
    const safeAccount = account.toObject();
    delete safeAccount.password;

    res.status(200).json({ success: true, message: 'Profile updated successfully.', account: safeAccount });
  } catch (err) {
    next(err);
  }
};
