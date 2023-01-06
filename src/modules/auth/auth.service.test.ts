import { AuthService } from './auth.service';

describe('Register user', () => {
  it('Username is already used', async () => {
    const body = {
      username: 'lqdsjfh@dsljh.com',
      password: 'dsljfn',
    };
    AuthService.register(body);
  });
});
