import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';

const classUserUrl = ipAddressComputer + '/api/v1/classes-info';

export async function getUsersInClass(class_id) {
  try {
      const response = await axios.get(classUserUrl + `/${class_id}`);
      return response.data;
  } 
  catch (error) {
      console.error('error while getting users in class', error);
      throw error;
  }
}

export async function createClassUser(user_id, class_id) {
    try {
      const response = await axios.post(classUserUrl, { user_id, class_id });
      return response.data[0];
    } 
    catch (error) {
      console.error('error while creating class user', error);
      throw error;
    }
}

export async function updateClassUser(user_id, class_id) {
  try {
    const response = await axios.put(classUserUrl + `/${user_id}`, { class_id });
    return response.data[0];
  } 
  catch (error) {
    console.error('error while updating class user', error);
    throw error;
  }
}

export async function deleteClassUser(user_id) {
  try {
    const response = await axios.delete(classUserUrl +  `/${user_id}`);
    return response.data[0];
  } 
  catch (error) {
    console.error('error while deleting class user', error);
    throw error;
  }
}

export async function deleteClassInfo(class_id) {
  try {
    const response = await axios.delete(classUserUrl +  `/class/${class_id}` );
    return response.data[0];
  } 
  catch (error) {
    console.error('error while deleting class info', error);
    throw error;
  }
}