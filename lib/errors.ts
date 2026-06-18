// Typed domain errors. Callers branch on the class (or `name`) instead of
// matching on message strings, and API routes can map each to the right HTTP
// status. Each sets `name` explicitly so it survives minification and shows
// up correctly in logs/stack traces.

/** Property code is well-formed but no such property exists. Maps to 404. */
export class PropertyNotFoundError extends Error {
  constructor(public readonly code: string) {
    super(`Nenhum imóvel encontrado para o código "${code}".`);
    this.name = "PropertyNotFoundError";
  }
}

/** Property code doesn't match the expected format (3 letters + 3 digits). Maps to 400. */
export class InvalidPropertyCodeError extends Error {
  constructor(public readonly code: string) {
    super(`Código de imóvel inválido: "${code}".`);
    this.name = "InvalidPropertyCodeError";
  }
}

/** AI guide generation failed or returned output that didn't validate. Maps to 502. */
export class AIGenerationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIGenerationError";
  }
}
