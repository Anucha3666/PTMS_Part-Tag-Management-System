import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="icon" type="image/svg+xml" href="https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Management-System/refs/heads/main/media/images/icon-ptms-white.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Site</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            background-color: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
          }
          .title {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          .subtitle {
            color: #666;
            font-size: 1.2em;
            line-height: 1.5;
            margin-bottom: 30px;
          }
          .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 50px;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">Hello, Welcome!</h1>
          <p class="subtitle">We're excited to have you here. But please go and use our main website.</p>
          <a href="https://ptms-ipc.vercel.app/login"><button class="button">Go to website IPC | PTMS</button></a>
        </div>
      </body>
      </html>
    `;
  }
}
