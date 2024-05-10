import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavTop from "../../components/common/NavTop";
import NavLeft from "../../components/common/NavLeft";

import toast from "react-hot-toast";
import styles from "./RunPage.module.css";
import run from "../../assets/run.png";
import rerun from "../../assets/rerun.png";
import stop from "../../assets/stop.png";
import edit from "../../assets/editIcon.png";
import remove from "../../assets/deleteIcon.png";
import setting from "../../assets/settingIcon.png";
import document from "../../assets/documentIcon.png";

import { deleteProject } from "../../api/Project";
import { getNginxConf } from "../../api/ngixn";
import { getDockerCompose } from "../../api/Docker";
import { checkProceeding } from "../../api/CheckProcess";

import useProjectStore from "../../stores/projectStore";
import useModalStore from "../../stores/modalStore";
import RunProjectList from "../../components/manage/RunProjectList";
import Modal from "../../components/modal/Modal";
import LoadingModal from "../../components/modal/LoadingModal";

export default function RunPage() {
  const [content, setContent] = useState("");

  const { modalOpen, setModalOpen } = useModalStore();
  const { fileType, setFileType } = useModalStore();
  const { checkProceed, setCheckProceed } = useProjectStore();
  const { loadingModal, setLoadingModal } = useModalStore();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      handleCheckProceding();
      setLoadingModal(false);
    } catch (error) {
      console.error("컨테이너 실행 확인 에러: ", error);
    }
  }, []);

  //실행상태 조회
  const handleCheckProceding = async () => {
    try {
      const response = await checkProceeding(selectedProject.projectId);
      if (response.data.status == "SUCCESS") {
        setCheckProceed(response.data.data);
        console.log(response.data.data);
      } else {
        setCheckProceed({ allRunning: "null" });
        toast.error(`프로젝트 실행상태를 불러올수 없습니다.`, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("컨테이너 실행 확인 에러: ", error);
    }
  };

  //프로젝트 삭제
  const handleDelete = async (projectId) => {
    try {
      const response = await deleteProject(projectId);
      if (response.data.status == "SUCCESS") {
        console.log(response);
        navigate("/main");
        toast.success(`프로젝트를 삭제했습니다`, {
          position: "top-center",
        });
      } else {
        toast.error(`프로젝트 삭제를 실패했습니다.`, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("프로젝트 삭제 실패: " + error);
      toast.error(`프로젝트 삭제를 실패했습니다.`, {
        position: "top-center",
      });
    }
  };

  //nginx config 조회
  const handleOpenNginxModal = async (projectId) => {
    try {
      const response = await getNginxConf(projectId);
      if (response.data.status == "SUCCESS") {
        await setFileType("nginx");
        setModalOpen(true);
        setContent(response.data.data);
      } else {
        toast.error("nginx config 파일 조회 실패", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("nginx config 조회 실패: " + error);
    }
  };

  //도커 컴포즈 조회
  const handleDockerComposeModal = async (projectId) => {
    try {
      console.log(projectId);
      const response = await getDockerCompose(projectId);
      if (response.data.status == "SUCCESS") {
        setModalOpen(true);
        setFileType("dockerCompose");
        setContent(response.data.data);
      } else {
        toast.error("도커 컴포즈 파일 조회 실패", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("docker compose 조회 실패: " + error);
    }
  };

  return (
    <>
      <NavTop />
      <NavLeft num={1} />
      <div className={styles.page}>
        <div className={styles.top}>
          <div>
            <div className={styles.text}>프로젝트</div>
            <div className={styles.projectName}>
              {selectedProject.projectName}
            </div>
          </div>
          <div className={styles.buttons}>
            <div
              className={styles.webhook}
              onClick={() => navigate("/manage/webhook")}
            >
              Webhook 설정{" "}
              <img
                src={setting}
                alt=""
                decoding="async"
                className={styles.btnIcon}
              />
            </div>
            <div
              className={styles.edit}
              onClick={() => navigate("/update/project")}
            >
              수정{" "}
              <img
                src={edit}
                alt=""
                decoding="async"
                className={styles.btnIcon}
              />
            </div>
            <div
              className={styles.remove}
              onClick={() => handleDelete(selectedProject.projectId)}
            >
              삭제{" "}
              <img
                src={remove}
                alt=""
                decoding="async"
                className={styles.btnIcon}
              />
            </div>
          </div>
        </div>
        <div className={styles.mid}>
          <div>
            <div className={styles.text}>프로젝트 전체 실행</div>
            <div className={styles.runButton}>
              {checkProceed.allRunning == "Run" && (
                <div>
                  <img src={rerun} width="40px"></img>
                  <img src={stop} width="40px"></img>
                </div>
              )}
              {checkProceed.allRunning == "Stop" && (
                <div>
                  <img src={run} width="40px"></img>
                  <img src={stop} width="40px"></img>
                </div>
              )}
            </div>
          </div>
          <div className={styles.buttons}>
            <div
              className={styles.fileButton}
              onClick={() => handleOpenNginxModal(selectedProject.projectId)}
            >
              nginx.config 파일 조회{" "}
              <img
                src={document}
                alt=""
                decoding="async"
                className={styles.btnIcon}
              />
            </div>
            <div
              className={styles.fileButton}
              onClick={() =>
                handleDockerComposeModal(selectedProject.projectId)
              }
            >
              docker-compose.yml 파일 조회{" "}
              <img
                src={document}
                alt=""
                decoding="async"
                className={styles.btnIcon}
              />
            </div>
          </div>
        </div>
        {checkProceed.allRunning == "Run" && (
          <RunProjectList setContent={setContent} />
        )}
      </div>
      {loadingModal && <LoadingModal />}
      {modalOpen && <Modal content={content} />}
    </>
  );
}
