import React, {createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4} from 'uuid';

const CustomContext = createContext();


export const CustomProvider = ({children}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [allProjects, setAllProjects] = useState(null);
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
    
    const [allTasks, setAllTasks] = useState(null);

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
            const response = await fetch('https://api.todoist.com/rest/v2/projects',{
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            })

            const data = await response.json();

            setAllProjects(data);
        }
        catch(error){
            console.log(error); 
        }
    }

    async function fetchTasks(){
        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
        try{
            const response = await fetch('https://api.todoist.com/rest/v2/tasks',{
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            })

            const data = await response.json();

            setAllTasks(data);
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

            const response = await fetch('https://api.todoist.com/rest/v2/projects', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(addProjectDetails)
              });

              if (response.ok) {
                fetchProjects(); 
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

            const response = await fetch(`https://api.todoist.com/rest/v2/projects/${projectBeingModified.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(projectBeingModified)
              });

              if (response.ok) {
                fetchProjects(); 
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

            const response = await fetch(`https://api.todoist.com/rest/v2/projects/${id}`, {
                method: 'DELETE',
                headers: { 
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

    const makeFavoriteOrUnfavorite = async(id) => {

        let project = allProjects.find((project) => project.id === id);

        const updatedProject = { ...project, is_favorite: !project.is_favorite };

        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';

        try{ 
            const response = await fetch(`https://api.todoist.com/rest/v2/projects/${id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProject)
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

        try{

            const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "content":addTask.taskName,
                    "description": addTask.taskDescription,
                     "deadline": {
                        "date": addTask.Date
                     },
                     "priority": addTask.Priority,
                     "project_id": addTask.Project_id
                })
              });

              if (response.ok) {
                fetchProjects();
                fetchTasks();
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

  
    const handleEditProject = (id) => {

        setProjectBeingModified(allProjects.find((project) => project.id === id));
        setIsProjectModalVisible(true);
    }

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
        handleEditProject
        }}>
            {children}
        </CustomContext.Provider>
    );
}


const useCustomContext = () => useContext(CustomContext); //creating custom hook for making it more simple

export default useCustomContext;

