import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost/k8s/token/';

class AuthService {

    login(credentials){
        return axios.post(USER_API_BASE_URL + "generate-token", credentials);
    }

    getUserInfo(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    getAuthHeader() {
       return {headers: {Authorization: 'Bearer ' + this.getUserInfo().token }};
    }

    logOut() {
        let header = this.getAuthHeader();
        localStorage.removeItem('userInfo');
        return axios.post(USER_API_BASE_URL + 'logout', {}, header);
    }
}

export default new AuthService();