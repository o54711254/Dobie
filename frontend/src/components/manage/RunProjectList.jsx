import styles from "./RunProjectList.module.css";
import RunProjectItem from "./RunProjectItem";
import useProjectStore from "../../stores/projectStore";

export default function RunProjectList({ setModalOpen, setContent }) {
  const { selectedProject, setSelectedProject } = useProjectStore();

  return (
    <>
      {Object.values(selectedProject.backendMap).length > 0 &&
        Object.values(selectedProject.databaseMap).length > 0 && (
          <div className={styles.bottom}>
            {Object.values(selectedProject.backendMap).map((container) => (
              <RunProjectItem
                key={container.serviceId}
                container={container}
                type="Backend"
                setModalOpen={setModalOpen}
                setContent={setContent}
              />
            ))}
            <RunProjectItem
              container={selectedProject.frontend}
              type="Frontend"
              setModalOpen={setModalOpen}
              setContent={setContent}
            />
            {Object.values(selectedProject.databaseMap).map((container) => (
              <RunProjectItem
                key={container.databaseId}
                container={container}
                type="Database"
                setModalOpen={setModalOpen}
                setContent={setContent}
              />
            ))}
          </div>
        )}
    </>
  );
}
