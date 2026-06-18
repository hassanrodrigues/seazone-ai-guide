/** AI model used for both guide generation and chat. */
export const AI_MODEL = "claude-sonnet-4-6" as const;

/**
 * Sampling temperatures. Guide generation allows mild variety in phrasing
 * while staying factual; chat is kept very low to maximize consistency and
 * minimize hallucination on stay-critical answers.
 */
export const GUIDE_TEMPERATURE = 0.4;
export const CHAT_TEMPERATURE = 0.2;

/** Token ceilings. Guides are richer structured output; chat replies are short. */
export const GUIDE_MAX_TOKENS = 2000;
export const CHAT_MAX_TOKENS = 300;

/** Property code format: 3 uppercase letters + 3 digits, e.g. "FLN001". */
export const PROPERTY_CODE_REGEX = /^[A-Z]{3}\d{3}$/;

/** Max length of a single user chat message, enforced client- and server-side. */
export const MAX_USER_MESSAGE_LENGTH = 1000;
