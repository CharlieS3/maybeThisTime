import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from './database/database-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // this adds a pre-processing step that runs on every incoming request, before any controller
  // we get a seession ID from this and can then determine if the user should be automatically logged in
  app.use(cookieParser());

  // Apply the filter to every route, app-wide (mirror of useGlobalPipes).
  app.useGlobalFilters(new DatabaseExceptionFilter());

    // Apply validation to every incoming request body, app-wide.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // strip any properties not declared in the DTO
      forbidNonWhitelisted: true,  // ...and reject the request (400) if extras are sent
    }),
  );


  // this allows the browser application (next.js) to read responses from NestJS
  // credentials: true allows cookies to sent/stored with the browser 
  app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// cd apps/api
// npm run start:dev
// http://localhost:3000

/*
CORS Breakdown:

CORS = Cross-Origin Resource Sharing.
Browsers enforce a security rule: JavaScript running on one origin (scheme + domain + port — so http://localhost:3001, Next.js) 
is not allowed to read responses from a different origin (http://localhost:3000, NestJS) by default. This protects users — 
without it, any random website you visit could silently make requests to your bank's API using your logged-in cookies 
and read the results.

The server being called gets to opt in. app.enableCors({ origin: 'http://localhost:3001' }) makes 
your API attach a header to responses:
Allow-Header: http://localhost:3001

When the browser sees that, it allows your Next.js page's JavaScript to read the API's response. Requests from 
any other origin still get blocked by the browser.


Note that it's not page-specific, it's origin-specific. The rule says "JavaScript served from 
http://localhost:3001 (any page of your Next app) may read responses from this API (any endpoint)."

-------------------------------------------
Simply put:

ANY Next.js page served from 

http://localhost:3001

can read from ANY NestJS page (theoretically we will have conditions and limits) at

http://localhost:3000
------------------------------------------

*/