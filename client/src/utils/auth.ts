interface DecodedToken {
  exp: number;
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

class Auth {
  public getToken() {
    return localStorage.getItem('id_token');
  }

  public getProfile() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      return decoded.exp < Date.now() / 1000;
    } catch (_err) {
      return false;
    }
  }
}

export default new Auth();