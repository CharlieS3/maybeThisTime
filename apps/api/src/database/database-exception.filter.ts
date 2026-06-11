/*

Instead of try/catch in every service method, we write one global exception filter — same idea as the 
global ValidationPipe, but for errors going out. It inspects the error code and translates it to the right HTTP response.

ValidationPipe (request-level): checks the body in isolation — is it the right shape, right types, right format? 
It can tell "not-a-uuid" is wrong, but it has no idea what's in your database.

Exception filter (database-level): catches rules that can only be checked against current data — does this 
brewery actually exist (FK)? Is this membership already taken (unique PK)? Postgres is the one enforcing these; the 
filter just translates its rejections into honest HTTP answers (400/409) instead of a generic 500.

*/


// ExceptionFilter = Nest's interface for "catch errors and shape the HTTP response".
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
// DatabaseError is the exact class the pg library throws for Postgres errors.
// pg is the whole node-postgres library
import { DatabaseError } from 'pg';
// Express response type (Nest uses Express under the hood).
import { Response } from 'express';

// @Catch(DatabaseError) = this filter ONLY handles pg errors.
// Everything else (including your ValidationPipe 400s) is untouched
// and keeps Nest's default behavior.
@Catch(DatabaseError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: DatabaseError, host: ArgumentsHost) {
    // Get the underlying HTTP response object so we can send our own reply.
    const response = host.switchToHttp().getResponse<Response>();

    // Postgres error codes are strings. Translate the ones we know.
    switch (exception.code) {
      case '23505': // unique_violation → e.g. duplicate membership
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: 'Resource already exists',
        });

      case '23503': // foreign_key_violation → valid UUID, but no such row
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Referenced resource does not exist',
        });

      default: // any other DB error: don't leak details, plain 500
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          message: 'Internal server error',
        });
    }
  }
}