import * as Config from '../constants/Config';
import axios from 'axios';


export default callApi = async (endpoint, method = 'GET', body, header = '') => {
  header = {
    "api-key": Config.API_KEY
  }
  return axios({
    method: method,
    url: `${Config.API_URL}${endpoint}`,
    data: body,
    headers: header,
    timeout: 90000,
  }).then(response => {
    console.log('HTTP', response);
    return response.data;
  }).catch((error) => {
    console.log('HTTPError', error);
    console.log('HTTPError2', endpoint, body);
    return error.response
  });
}

