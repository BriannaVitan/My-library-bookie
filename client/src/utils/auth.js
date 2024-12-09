class Auth {
    static loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }
    static logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
    static getToken() {
        return localStorage.getItem('id_token');
    }
    static isTokenExpired(token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    }
}
export default Auth;
