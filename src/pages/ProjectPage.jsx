import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCustomContext from '../CustomContext';
import TaskDisplay from '../components/TaskDisplay';

const ProjectPage = () => {
  const { id } = useParams();
  const { fetchProjects, allProjects, fetchTasks, allTasks } = useCustomContext();

  const [projectTitle, setProjectTitle] = useState('');
  const [tasksForParticularProjectId, setTasksForParticularProjectId] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (allProjects && allProjects.length > 0) {
      const project = allProjects.find((project) => project.id === id);
      if (project) setProjectTitle(project.name);
    }
  }, [allProjects, id]); // Runs when allProjects updates

  useEffect(() => {

    if (allTasks && allTasks.length > 0) {
      const tasks = allTasks.filter((task) => task.project_id === id);
      setTasksForParticularProjectId(tasks);
    }

    
  }, [allTasks, id]); // Runs when allTasks updates

  return (
    <div>
      {projectTitle ? (
        <>
          <h1>{projectTitle}</h1>
          {tasksForParticularProjectId.length > 0 ? (
            <TaskDisplay tasksForParticularProjectId={tasksForParticularProjectId}/>
          ) : (
            <p>No tasks found for this project.</p>
          )}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectPage;
