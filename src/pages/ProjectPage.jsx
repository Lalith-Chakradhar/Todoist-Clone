import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TaskDisplay from '../components/TaskDisplay';
import { Flex, Typography, Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import AddTaskBox from '../components/AddTaskBox';

import { fetchProjects, allProjects } from '../features/projects/projectSlice';
import { fetchTasks, allTasks } from '../features/tasks/taskSlice';

const { Title } = Typography;

const ProjectPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const projects = useSelector(allProjects);
  const tasks = useSelector(allTasks);

  const [projectTitle, setProjectTitle] = useState('');
  const [tasksForParticularProjectId, setTasksForParticularProjectId] = useState([]);

  const [showAddTaskBox, setShowAddTaskBox] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);


  useEffect(() => {
    if (projects.length > 0) {
      const project = projects.find((project) => project.id === id);
      if (project) 
      {
        setProjectTitle(project.name);
        document.title = project.name;
      }
    }
  }, [allProjects, id]); // Runs when allProjects updates

  useEffect(() => {

    if(tasks.length > 0) {
      const tasksOfAProject = tasks.filter((task) => task.project_id === id);
      setTasksForParticularProjectId(tasksOfAProject);
    }

  }, [tasks, id]); // Runs when allTasks updates

  return (
    <div>
      {projectTitle ? (
        <>
          <div style={{height: '90vh', display: 'flex', alignItems: 'start', justifyContent: 'center'}}>
          
            <Flex style={{width: '60%',height: '80%', marginTop: '5em'}}  align={'start'} vertical >
                
                <Title level={3}>{projectTitle}</Title>
                
                {tasksForParticularProjectId.length > 0 && (
                  <TaskDisplay tasksForParticularProjectId={tasksForParticularProjectId}/>
                )}
                
                {(showAddTaskBox) ? 
                (<AddTaskBox setShowAddTaskBox={setShowAddTaskBox}/>) : 
                (<Button 
                  icon={<PlusCircleFilled style={{ color: '#dc4c3e', fontSize: '1.2rem'}}/>} 
                  type="text" 
                  onClick={()=>setShowAddTaskBox(true)}>Add Task</Button>)}
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
