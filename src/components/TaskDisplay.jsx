import React,{useState, useEffect} from "react";
import { Radio } from "antd";
import TaskModal from "./TaskModal";
import useCustomContext from '../CustomContext';


const TaskDisplay = ({ tasksForParticularProjectId }) => {

 const { setIsModalOpen, setAllTasks, fetchProjects, fetchTasks } = useCustomContext();
 const [editMode, setEditMode] = useState(false);
 const [taskBeingEdited, setTaskBeingEdited] = useState(null);


 const handleTaskDelete = async(taskToBeDeleted) => {


    setAllTasks((prevTasks) =>
        prevTasks.filter(task =>
            task.id !== taskToBeDeleted.id
        )
    );

    
    const token ='f402b0ee01be435cc94f15426476f780d16dbd68';


    try{

        const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskToBeDeleted.id}`, {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${token}`,
            }
          });


        if (response.ok) {
            fetchProjects();
            fetchTasks();
         }

    }catch(error)
    {
        console.log(error);
    } 
}

 function activateEditMode(task){
    setEditMode(true);
    setTaskBeingEdited(task);
    setIsModalOpen(true);
 }

  return (
    <div>
      {tasksForParticularProjectId.map((task) => (
        <div key={task.id} style={{width:'70%'}}>
           <Radio>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>{task.content}</div>
                <div>
                    <button style={{cursor: 'pointer', display: editMode ? 'none' : 'inline'}} onClick={()=>activateEditMode(task)}>Edit</button>
                    {editMode && taskBeingEdited?.id === task.id &&  (<TaskModal editMode={editMode} setEditMode={setEditMode} taskBeingEdited={taskBeingEdited} setTaskBeingEdited={setTaskBeingEdited}/>)}
                    <button style={{cursor: 'pointer'}} onClick={()=>handleTaskDelete(task)}>Delete</button>
                </div>
            </div>
            </Radio>
        </div>
      ))}
    </div>
  );
};


export default TaskDisplay;