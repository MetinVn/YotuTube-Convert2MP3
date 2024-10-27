import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

// Sign up user with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    await sendEmailVerification(user);
    await signOut(auth);

    return { message: "Verification email sent. Please verify your email." };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign in user with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      return user;
    } else {
      await signOut(auth);
      throw new Error("Email not verified. Please check your inbox and verify your email.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update User Profile
export const updateUserProfile = async (newDisplayName) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You are not logged in.");
  }

  if (!newDisplayName || newDisplayName === user.displayName) {
    throw new Error("Display name must be different from the current name and not empty.");
  }

  try {
    await updateProfile(user, { displayName: newDisplayName });
    console.log("Profile updated successfully.");
  } catch (error) {
    console.error("Profile update error:", error);
    throw new Error(error.message);
  }
};

// Change Password
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  if (!user) throw new Error("You are not logged in.");

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
    console.log("Password changed successfully.");
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error("Failed to change password. Please check your current password.");
  }
};

// Password Reset Functionality
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
    return { message: "Password reset email sent successfully." };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email. Please try again.");
  }
};

// Sign Out User
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};
