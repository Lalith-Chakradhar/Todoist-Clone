import React, {createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4} from 'uuid';
import axios from 'axios';

const CustomContext = createContext();


export const CustomProvider = ({children}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [allProjects, setAllProjects] = useState([]);
    const [addProjectDetails, setAddProjectDetails] = useState({
        name: '',
        color: '',
        is_favorite: false,
        view_style: 'list'
    });

    const [viewStyle, setViewStyle] = useState('list');

    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
    
    const [projectBeingModified, setProjectBeingModified] = useState(null);

    const [addTask, setAddTask] = useState({
        taskName: '',
        taskDescription: '',
        Date: '',
        Priority: '',
        Project_id: ''
    })
    
    const [allTasks, setAllTasks] = useState([]);


    const [editMode, setEditMode] = useState(false);
    const [taskBeingEdited, setTaskBeingEdited] = useState(null);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleTaskDelete = async() => { 
    
        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
        
        try{
            const response = await axios.delete(`https://api.todoist.com/rest/v2/tasks/${taskToDelete.id}`, {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                }
              });
    
    
             if(response.status === 200)
             {
                    setAllTasks((prevTasks) =>
                      prevTasks.filter(task =>
                          task.id !== taskToDelete.id
                      )
                    ); 
             }
    
        }catch(error)
        {
            console.log(error);
        }
        finally {
          setIsDeleteModalVisible(false);
          setTaskToDelete(null);
        }
    }
    
    const showDeleteModal = (task) => {
      setTaskToDelete(task);
      setIsDeleteModalVisible(true);
    };
    
    function activateEditMode(task){
        setEditMode(true);
        setTaskBeingEdited(task);
        setIsModalOpen(true);
     }
    


    const showProjectModal = () => {
        setIsProjectModalVisible(true);
    };

    const setView = (value) => {

        setViewStyle(value);

        if(projectBeingModified)
        {
            setProjectBeingModified({...projectBeingModified, view_style: value});
        }
        else
        {
            setAddProjectDetails({...addProjectDetails, view_style: value});
        }   
    }


    async function fetchProjects(){

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
        try{
            const response = await axios.get('https://api.todoist.com/rest/v2/projects',{
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            })

            setAllProjects([...response.data]);
        }
        catch(error){
            console.log(error); 
        }
    }

    async function fetchTasks(){
        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
        try{
            const response = await axios.get('https://api.todoist.com/rest/v2/tasks',{
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            })

            setAllTasks([...response.data]);
        }
        catch(error){
            console.log(error); 
        }
    }

    useEffect(()=>{
        fetchProjects();
        fetchTasks();
    },[])


    const handleAddProjectOk = async () => {

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';

        try{ 
            const response = await axios.post('https://api.todoist.com/rest/v2/projects',addProjectDetails, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (response.status === 200) { 
                setAllProjects(prevProjects => [...prevProjects, response.data]);
              }

        }catch(error)
        {
            console.log(error);
        }
        finally{
            setIsProjectModalVisible(false);
            setAddProjectDetails({
                name: '',
                color: '',
                is_favorite: false,
                view_style: 'list'
            });
        }
    };

    const handleEditProjectDataOk = async() => { 

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';

        try{

            const response = await axios.post(`https://api.todoist.com/rest/v2/projects/${projectBeingModified.id}`,projectBeingModified, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (response.status === 200) {  
                setAllProjects(prevProjects => 
                  prevProjects.map(project => 
                    project.id === projectBeingModified.id ? { ...project, ...response.data } : project
                  )
                );
              }

        }catch(error)
        {
            console.log(error);
        }
        finally{
            setIsProjectModalVisible(false);
            setProjectBeingModified(null);
        }
    };


    const handleDeleteProject = async(id)=>{

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
        try{

            const response = await axios.delete(`https://api.todoist.com/rest/v2/projects/${id}`, { 
                headers: { 
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (response.status === 200) { 
                setAllProjects(prevProjects => prevProjects.filter(project => project.id !== id));
              }

        }catch(error)
        {
            console.log(error);
        } 
    }

    const makeFavoriteOrUnfavorite = async(id) => {

        let project = allProjects.find((project) => project.id === id);

        const updatedProject = { ...project, is_favorite: !project.is_favorite };

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';

        try{ 
            const response = await axios.post(`https://api.todoist.com/rest/v2/projects/${id}`, updatedProject, {
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (response.ok) {
                fetchProjects();
            }

        }catch(error)
        {
            console.log(error);
        } 
    }



    const addToFavorites = (checked) => {

        if(projectBeingModified)
        {
            if(checked)
            {    
                setProjectBeingModified({...projectBeingModified, is_favorite: true});
            }
            else
            {
                setProjectBeingModified({...projectBeingModified, is_favorite: false});
            }
        }
        else
        {
            if(checked)
            {    
                setAddProjectDetails({...addProjectDetails, is_favorite: true});
            }
            else
            {
                setAddProjectDetails({...addProjectDetails, is_favorite: false});
            }
        }
    }

    const handleProjectCancel = () => {
        setIsProjectModalVisible(false);

        if(projectBeingModified)
        {
            setProjectBeingModified(null);
        }
        else
        {
            setAddProjectDetails({
                name: '',
                color: '',
                is_favorite: false,
                view_style: 'list'
            });
        }
    };
    


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleTaskOk = async() => {

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';

        const addTaskObject = {
                                    "content":addTask.taskName,
                                    "description": addTask.taskDescription,
                                    "deadline": {
                                        "date": addTask.Date
                                    },
                                    "priority": addTask.Priority,
                                    "project_id": addTask.Project_id
                                };
        try{

            const response = await axios.post('https://api.todoist.com/rest/v2/tasks', addTaskObject, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (response.status === 200) {
                setAllTasks(prevTasks => [...prevTasks, response.data]);
              }

        }catch(error)
        {
            console.log(error);
        }
        finally{
            setIsModalOpen(false);
            setAddTask({
                taskName: '',
                taskDescription: '',
                Date: '',
                Priority: '',
                Project_id: ''
            });
        }
        
    };

    const handleTaskCancel = () => {
        setIsModalOpen(false);
    };


    const handleEditTaskOk = async() => {

        
        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';


        try{

            const response = await axios.post(`https://api.todoist.com/rest/v2/tasks/${taskBeingEdited.id}`, taskBeingEdited, { 
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                }
              });


              if(response.status === 200)
              {
                setAllTasks((prevTasks) =>
                    prevTasks.map(task =>
                        task.id === taskBeingEdited.id ? { ...task, ...taskBeingEdited } : task
                    )
                );
              }

        }catch(error)
        {
            console.log(error);
        }
        finally{
            setIsModalOpen(false);
            setTaskBeingEdited(null);
            setEditMode(false);
        }
        
    };

    const handleEditTaskCancel = () => {
        setIsModalOpen(false);
        setTaskBeingEdited(null);
        setEditMode(false);
    };

  

    return (
        <CustomContext.Provider value={{isModalOpen,
        setIsModalOpen,
        allProjects,
        setAllProjects,
        addProjectDetails,
        setAddProjectDetails,
        viewStyle,
        setViewStyle,
        isProjectModalVisible,
        setIsProjectModalVisible,
        projectBeingModified,
        setProjectBeingModified,
        addTask,
        setAddTask,
        fetchTasks,
        allTasks,
        setAllTasks,
        showProjectModal,
        setView,
        fetchProjects,
        handleAddProjectOk,
        handleEditProjectDataOk,
        handleDeleteProject,
        makeFavoriteOrUnfavorite,
        addToFavorites,
        handleProjectCancel,
        showModal,
        handleTaskOk,
        handleTaskCancel,
        editMode,
        isDeleteModalVisible,
        handleTaskDelete,
        taskToDelete,
        activateEditMode,
        setEditMode,
        taskBeingEdited,
        setTaskBeingEdited,
        showDeleteModal,
        setIsDeleteModalVisible,
        handleEditTaskOk,
        handleEditTaskCancel
        }}>
            {children}
        </CustomContext.Provider>
    );
}


const useCustomContext = () => useContext(CustomContext); //creating custom hook for making it more simple

export default useCustomContext;

