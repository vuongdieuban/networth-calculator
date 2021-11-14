import { of } from 'rxjs';
import { tokenCredentialsInfoMock } from '../../mock/token-credentials-info.mock';
import { AuthService } from '../auth.service';

export class AuthServiceMock extends AuthService {
  public get tokenCredentialsInfo() {
    return tokenCredentialsInfoMock;
  }

  renewToken = jest.fn().mockReturnValue(of(this.tokenCredentialsInfo.userId));
  register = jest.fn().mockReturnValue(of(this.tokenCredentialsInfo.userId));
  login = jest.fn().mockReturnValue(of(this.tokenCredentialsInfo.userId));
  logout = jest.fn().mockReturnValue(of(void 0));
}
