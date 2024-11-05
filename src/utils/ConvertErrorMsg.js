export const getErrorMessage = (firebaseErrorMessage) => {
  const errorCodeMatch = firebaseErrorMessage.match(/\(([^)]+)\)/);
  const code = errorCodeMatch ? errorCodeMatch[1] : null;

  switch (code) {
    case "auth/invalid-credential":
      return "Password or Email is incorrect.";
    case "auth/email-already-in-use":
      return "This email address is already in use. You can go ahead and log in.";
    case "auth/weak-password":
      return "The password is too weak. It should be at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
