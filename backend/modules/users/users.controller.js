import  models  from '../../model/account.model.js';

const {Account} =models


// Update user profile (name and/or password)
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, currentPassword, newPassword } = req.body;
    const account = await Account.findById(req.userId).select('+password');
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    if (firstName) account.firstName = firstName;
    if (lastName) account.lastName = lastName;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required.' });
      }
      const match = await account.comparePassword(currentPassword);
      if (!match) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      account.password = newPassword; // hashed by pre-save hook
    }

    await account.save();
    const safe = account.toObject();
    delete safe.password;

    res.status(200).json({ success: true, message: 'Profile updated.', account: safe });
  } catch (err) {
    next(err);
  }
};

// Delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await Account.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Approve user
export const approveUser = async (req, res, next) => {
  try {
    const user = await Account.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isApproved = true;
    await user.save();

    const safe = user.toObject();
    delete safe.password;

    res.status(200).json({ success: true, message: 'User approved.', user: safe });
  } catch (err) {
    next(err);
  }
};

// Get all approved users
export const getUsersIsApproved = async (req, res, next) => {
  try {
    const users = await Account.find({ role: 'User', isApproved: true }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// Get all unapproved users
export const getUsersIsNotApproved = async (req, res, next) => {
  try {
    const users = await Account.find({ role: 'User', isApproved: false }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Account.find({ role: 'User'}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

