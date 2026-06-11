// A DTO (Data Transfer Object) is an object that defines how data will be sent over the network. 
// It acts as a contract between the client and the server, ensuring that only the necessary data is transmitted and validated.

import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto  {

    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

}