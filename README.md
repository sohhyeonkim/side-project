## Error Handling

1. `JwtModule`을 import해서 AuthModule에서 JwtService를 사용할 때, `secretOrPrivateKey` must have a value 에러 발생

    <a href="https://velog.io/@daep93/Nestjs-secretOrPrivateKey-must-have-a-value">참고 링크</a>
    ```js
      // AppModule에서 ConfigModule을 import할때
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        // ... 기타 다른 모듈 import
      ]

      // AuthModule에서 JwtModule을 import할때
      imports: [
      JwtModule.register({
        isGlobal: true,
        publicKey: process.env.JWT_PUBLIC_KEY,
        privateKey: process.env.JWT_PRIVATE_KEY,
        signOptions: { expiresIn: '1d' },
        signOptions: { algorithm: 'ES256', expiresIn: '3h' },
      }),
      // ... 기타 다른 모듈 import
      ]
    ```

    Nestjs에서는 `@nestjs/config`에서 제공하는 `ConfigModule`를 사용해 .env 파일에 접근할 수 있다. 그래서 위와 같이  AppModule에서 ConfigModule을 import하고, global 옵션을 true로 설정해두어서 다른 모듈에서 ConfigService를 주입받아 사용할 수 있다.

    그런데, 환경변수를 읽어오는 작업은 비동기로 처리되기 때문에, `JwtModule`에서 `process.env.JWT_PUBLIC_KEY`, `process.env.JWT_PRIVATE_KEY`를 참조할 때까지 .env를 다 못 읽어오는 문제가 발생한다. 이 문제를 해결하기 위해서는 `JwtModule`에서 제공하는 `registerAsync`라는 메소드를 사용해서 .env를 읽어올 때까지 `JWT_PUBLIC_KEY`와 `JWT_PRIVATE_KEY`를 등록하는 작업을 유예시킬 수 있다.

    ```js
      // AuthModule에서 JwtModule을 import할때
      imports: [
        JwtModule.registerAsync({
          inject: [ConfigService],, // ConfigService 주입해서 .env를 다 읽어올때까지 기다린다.
          useFactory: async (configService: ConfigService) => ({
            publicKey: configService.get('JWT_PUBLIC_KEY'),
            privateKey: configService.get('JWT_PRIVATE_KEY'),
            signOptions: { expiresIn: '1d' },
            signOptions: { algorithm: 'ES256', expiresIn: '3h' },
          }),
          
        }),
        // ... 기타 다른 모듈 import
      ]
    ```

    환경변수 `JwtModule.register`에서 `process.env.JWT_PUBLIC_KEY`, `process.env.JWT_PRIVATE_KEY`를 참조할 때까지 .env를 다 못 읽어오지 못해 발생한 이슈이다. `JwtModule`에는 `registerAsync`라는 메소드가 있는데 여기에 `ConfigService`를 주입해두면 .env를 읽어올 때까지 `JWT_PUBLIC_KEY`와 `JWT_PRIVATE_KEY`를 등록하는 작업을 유예시킬 수 있다.

