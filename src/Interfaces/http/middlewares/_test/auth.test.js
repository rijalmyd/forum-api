import authenticate from '../auth.js'; // sesuaikan path ke file middleware Anda
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';

describe('authenticate middleware', () => {
  it('should throw error 401 when authorization header not found', async () => {
    const req = {
      headers: {},
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();
    const middleware = authenticate({});

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Missing authentication',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should orchestrating the authentication action correctly', async () => {
    const token = 'Bearer valid_token';
    const decodedPayload = { id: 'user-123', username: 'dicoding' };
    const req = {
      headers: {
        authorization: token,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockAuthenticationTokenManager.decodePayload = vi.fn()
      .mockImplementation(() => Promise.resolve(decodedPayload));

    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockAuthenticationTokenManager),
    };

    const middleware = authenticate(mockContainer);

    await middleware(req, res, next);

    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');
    expect(req.user).toEqual(decodedPayload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 when token is invalid or expired', async () => {
    const token = 'Bearer invalid_token';
    const req = {
      headers: {
        authorization: token,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockAuthenticationTokenManager.decodePayload = vi.fn()
      .mockImplementation(() => Promise.reject(new Error('token expired')));

    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockAuthenticationTokenManager),
    };

    const middleware = authenticate(mockContainer);

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'token expired',
    });
    expect(next).not.toHaveBeenCalled();
  });
});