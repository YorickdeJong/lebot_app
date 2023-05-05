import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';

const groupUserUrl = ipAddressComputer + '/api/v1/groups-info';

export async function getUsersInGroup(group_id) {
    try {
        const response = await axios.get(groupUserUrl + `/${group_id}`);
        return response.data;
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createGroupUser(user_id, group_id, class_id) {
    try {
      const response = await axios.post(groupUserUrl, { user_id, group_id, class_id });
      return response.data[0];
    } 
    catch (error) {
      console.error(error);
      throw error;
    }
}

export async function updateGroupUser(user_id) {
    try {
      const response = await axios.put(groupUserUrl + `/${user_id}`);
      return response.data[0];
    } 
    catch (error) {
      console.error(error);
      throw error;
    }
}

export async function deleteGroupUser(user_id) {
    try {
      const response = await axios.delete(groupUserUrl +  `/${user_id}`);
      return response.data[0];
    } 
    catch (error) {
      console.error(error);
      throw error;
    }
}

export async function deleteGroupInfo(group_id) {
  try {
    console.log(group_id)
    const response = await axios.delete(groupUserUrl +  `/group/${group_id}`);
    return response.data[0];
  } 
  catch (error) {
    console.log('failed to delete')
    console.error(error);
    throw error;
  }
}

export async function deleteAllGroupsInfo(class_id) {
  try {
    const response = await axios.delete(groupUserUrl +  `/all/${class_id}`);
    return response.data[0];
  } 
  catch (error) {
    console.error(error);
    throw error;
  }
}