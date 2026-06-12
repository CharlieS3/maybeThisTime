import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    // Constructor: runs when the class is created. Nest creates it for us and
    // automatically passes in (injects) the AuthService instance it manages.
    // `private authService` = shorthand: store it as this.authService.
    constructor (private authService: AuthService) {}

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        // @Res gives us the raw response object so we can attach a cookie.
        // passthrough: true = "I only want to add things (a cookie);
        // Nest, please still handle sending the JSON return value as usual."
        // Without passthrough, Nest hands over FULL control and our
        // `return` would silently do nothing.
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(dto);

        // Pull sessionId OUT of the result: it goes in the cookie,
        // not the JSON body. `...user` collects every other field.
        const { sessionId, ...user } = result;

        // Set the cookie on the response.
        res.cookie('session_id', sessionId, {
            httpOnly: true,                  // page JavaScript cannot read it (XSS protection)
            sameSite: 'lax',                 // not sent on most cross-site requests (CSRF protection)
            maxAge: 7 * 24 * 60 * 60 * 1000, // browser keeps it 7 days (in ms) — matches expires_at
            // secure: true,                 // "HTTPS only" — enable in production; off for localhost
        });

        // Body now contains everything EXCEPT the sessionId.
        return user;
    }

    // @Req gives us the incoming request 
    @Post('logout')
    async logout(
        // @Req = the incoming request. cookie-parser has already turned the
        // raw Cookie header into the req.cookies object for us.
        @Req() req: Request,
        // Same pattern as login: passthrough lets us touch headers/cookies
        // while Nest still sends our return value as the JSON body.
        @Res({ passthrough: true }) res: Response,
    ) {
        // The cookie value, or undefined if the browser sent no cookie
        // (e.g. already logged out, or cookie expired).
        const sessionId = req.cookies.session_id;

        // Only hit the database if there was actually a ticket to destroy.
        if (sessionId) {
            await this.authService.logout(sessionId);
        }

        // Tell the browser to delete its copy of the cookie.
        // Works by sending Set-Cookie with an already-past expiry date.
        res.clearCookie('session_id');

        // Note: even with no/unknown sessionId we still return success —
        // "logged out" is true either way, nothing useful to error about.
        return { success: true };
    }
}




// from apps/api

// Login:
// curl.exe -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Albert\",\"password\":\"password1234\"}"

// Logout:
// 