import React,{useState} from "react";
import { Radio, Button, Flex, Space, Typography, Divider} from "antd";
import {EditOutlined, DeleteTwoTone} from '@ant-design/icons';
import TaskModal from "./TaskModal";
import useCustomContext from '../CustomContext';

const {Text, Paragraph} = Typography;


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
        <div key={task.id}> 
        <Space style={{width:'70%', marginBottom: '1em'}}>
           <Radio>
            <Flex style={{width:'40vw', marginTop: '2em'}} justify={'space-between'} align={'start'}> 
                <div>
                  <Text>{task.content}</Text>
                  <Paragraph type="secondary">{task.description}</Paragraph>
                </div>
                <Space size='large'>
                    <Button style={{display: editMode ? 'none' : 'inline'}} onClick={()=>activateEditMode(task)} icon={<EditOutlined/>}/>
                    {editMode && taskBeingEdited?.id === task.id &&  (<TaskModal editMode={editMode} setEditMode={setEditMode} taskBeingEdited={taskBeingEdited} setTaskBeingEdited={setTaskBeingEdited}/>)}
                    <Button onClick={()=>handleTaskDelete(task)} icon={<DeleteTwoTone twoToneColor='#dc4c3e'/>}/>
                </Space>
            </Flex>
            </Radio>  
        </Space>
        <Divider style={{margin: '0em'}}/>
        </div>
      ))}
    </div>
  );
};


export default TaskDisplay;