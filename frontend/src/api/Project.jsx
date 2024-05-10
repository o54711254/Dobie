import axios from "axios";
import { func } from "prop-types";

// const projectUrl = "http://localhost:8080/api/project";
const projectUrl = process.env.REACT_APP_SERVER + "/project";

//프로젝트 전체 조회
export async function getProject() {
  try {
    const response = await axios.get(projectUrl);
    console.log(typeof response);
    return response;
  } catch (error) {
    // console.log("회원가입 실패: " + error);
    throw error;
  }
}
//프로젝트 삭제
export async function deleteProject(projectId) {
  try {
    const response = await axios.delete(`${projectUrl}/delete/${projectId}`);
    return response;
  } catch (error) {
    // console.log("회원가입 실패: " + error);
    throw error;
  }
}

export async function createProject(project) {
  try{
    const response = await axios.post(`${projectUrl}/regist`, project);
    return response;
  }catch (error) {
    throw error;
  }
}


export async function stopProject(projectId){
  try{
    const response = await axios.post(`${projectUrl}/stop/${projectId}`);
    return response;
  } catch(error){
    throw error;
  }
}