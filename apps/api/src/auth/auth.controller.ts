import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    // Constructor: runs when the class is created. Nest creates it for us and
    // automatically passes in (injects) the AuthService instance it manages.
    // `private authService` = shorthand: store it as this.authService.
    constructor (private authService: AuthService) {}

    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }

}



// from apps/api
// curl.exe -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"user4\",\"password\":\"mytestpassword\"}"