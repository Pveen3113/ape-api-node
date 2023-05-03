export enum ErrorCodes {
  FIREBASE_AUTHENTICATION_ERROR = "E001",
  INVALID_REFRESH_TOKEN = "E002",
  USER_NOT_FOUND = "E003",
  INVALID_SPECIES_ID = "E004",
  INVALID_PAYMENT_ID = "E005",
  INVALID_ORDER_ID = "E006",
}

export const ERROR_TITLE: Record<ErrorCodes, string> = {
  [ErrorCodes.FIREBASE_AUTHENTICATION_ERROR]: "Invalid Firebase ID token",
  [ErrorCodes.INVALID_REFRESH_TOKEN]: "Invalid Refresh Token. Please log in",
  [ErrorCodes.USER_NOT_FOUND]: "User not found for the given ID",
  [ErrorCodes.INVALID_SPECIES_ID]: "Invalid species ID",
  [ErrorCodes.INVALID_PAYMENT_ID]: "Invalid payment ID",
  [ErrorCodes.INVALID_ORDER_ID]: "Invalid order ID",
};
