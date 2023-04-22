export default {
  signInWithEmailAndPasswordMock: jest.fn((email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      return Promise.resolve({ user: { email: 'test@example.com' } });
    }
    return Promise.reject(new Error('Invalid email or password'));
  }),
};
