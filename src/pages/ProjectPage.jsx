import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCustomContext from '../CustomContext';
import TaskDisplay from '../components/TaskDisplay';
import { Flex } from 'antd';
import { Typography, Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

const { Title } = Typography;

const ProjectPage = () => {
  const { id } = useParams();
  const { showModal, fetchProjects, allProjects, fetchTasks, allTasks } = useCustomContext();

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
        <div style={{height: '90vh', display: 'flex', alignItems: 'start', justifyContent: 'center'}}>
         <Flex style={{width: '60%',height: '80%', marginTop: '5em'}}  align={'start'} vertical >
            <Title level={3}>{projectTitle}</Title>
            {tasksForParticularProjectId.length > 0 ? (
              <TaskDisplay tasksForParticularProjectId={tasksForParticularProjectId}/>
            ) : (
              <p>No tasks found for this project.</p>
            )}
            <Button icon={<PlusCircleFilled style={{color: '#dc4c3e', fontSize: '1.2rem'}}/>} type="text" onClick={showModal}>Add Task</Button>
          </Flex>
          
          </div>
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectPage;
