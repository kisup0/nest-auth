import { HttpException, HttpStatus } from '@nestjs/common';

export const authExceptionMessage = 'AuthException: Unauthorized';

/**
 * Throws a HttpException with a 429 status code, indicating that too many
 * requests were being fired within a certain time window.
 * @publicApi
 */
export class AuthException extends HttpException {
  constructor(message?: string) {
    super(`${message || authExceptionMessage}`, HttpStatus.UNAUTHORIZED);
  }
}
