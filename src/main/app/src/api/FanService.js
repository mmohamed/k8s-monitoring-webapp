import axios from 'axios';
import AuthService from './AuthService'

const USER_API_BASE_URL = process.env.REACT_APP_URL_BASE + '/fan/';

class FanService{
	
	change(on){
		return axios.post(USER_API_BASE_URL + (on ? 'on' : 'off'), null, AuthService.getAuthHeader());
	}
	
	status(){
		return axios.get(USER_API_BASE_URL + 'status', AuthService.getAuthHeader());
	}
}

export default new FanService();