export interface CredentialsTokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredTs: string; // unix time
  refreshTokenExpiredTs: string;
}
