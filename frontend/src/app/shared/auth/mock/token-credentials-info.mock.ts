import { TokenCredentialsInfo } from '../dtos/token-credentials-info.dto';

export const tokenCredentialsInfoMock: TokenCredentialsInfo = {
  userId: 'abc123',
  accessToken: 'def456',
  accessTokenExpiredTs: '2021-11-13T18:42:48-07:00',
  refreshTokenExpiredTs: '2021-11-20T17:42:48-07:00',
};
