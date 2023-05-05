import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';
const url = ipAddressComputer + '/api/v1/groups';

export async function getIndividualGroup(id) {
    try {
        const response = await axios.get(url + `/${id}`);
        return response.data[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getGroupsPerClassRoom({class_id, school_id}) {
    try {
        const response = await axios.get(url + `/classroom?class_id=${class_id}&school_id=${school_id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getGroupsPerSchool(school_id) {
    try {
        const response = await axios.get(url + `/school?school_id=${school_id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function createGroup({ name, school_id, max_count, class_id }) {
    try {
      const response = await axios.post(url, { name, school_id, max_count, class_id});
      return response.data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
}
  
  export async function updateGroup({ group_id, name, max_count, class_id, school_id }) {
    try {
      const response = await axios.put(url + `/${group_id}`, { name, max_count, class_id, school_id });
      return response.data[0];
    } catch (error) {
      console.log(error);
    }
}

export async function deleteGroupByID(group_id) {
    try {
        const response = await axios.delete(url + `/${group_id}`);
        return response.data[0];
    } 
    catch (error) {
        console.log('Error something went wrong: ', error);
    }
}

export async function deleteAllGroupInClass(class_id) {
    console.log('class_id', class_id)
    try {
        const response = await axios.delete(url + `/all/${class_id}`);
        return response.data[0];
    } 
    catch (error) {
        console.log('Error something went wrong: ', error);
    }
}