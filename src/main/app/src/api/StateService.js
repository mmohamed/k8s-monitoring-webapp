import axios from 'axios';
import AuthService from './AuthService'

const USER_API_BASE_URL = process.env.REACT_APP_URL_BASE + '/state/';

class StateService{
	
	global(){
		return axios.get(USER_API_BASE_URL + 'global', AuthService.getAuthHeader());
	}
	
	pods(){
		return axios.get(USER_API_BASE_URL + 'pods', AuthService.getAuthHeader());
	}
	
	nodes(){
		return axios.get(USER_API_BASE_URL + 'nodes', AuthService.getAuthHeader());
	}
}

export default new StateService();