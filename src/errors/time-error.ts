/**
 * Class TimeError extends native Error class.
 * It allows the creation of custom errors
 */
class TimeError extends Error {
  /**
   * Time Error instance.
   *
   * @param {string} message - Error message.
   * @param {number} [code] - Optional error code, used for creating specific
   * error handling.
   */
  constructor(message: string, public code?: number) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
  }

  /**
   * Return formatted error message.
   *
   * @return {string} String build with name, code and message.
   */
  getErrorMessage(): string {
    return `${this.name} (${this.code}): ${this.message}`;
  }
}

export default TimeError;
