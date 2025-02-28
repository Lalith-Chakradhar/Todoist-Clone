import React,{useState} from "react";
import {Modal, Radio, Button, Flex, Space, Typography, Divider} from "antd";
import {EditOutlined, DeleteTwoTone} from '@ant-design/icons';
import TaskModal from "./TaskModal";
import useCustomContext from '../CustomContext';

const {Text, Paragraph} = Typography;


const TaskDisplay = ({ tasksForParticularProjectId }) => {

 const { setIsModalOpen, setAllTasks, fetchProjects, fetchTasks } = useCustomContext();
 const [editMode, setEditMode] = useState(false);
 const [taskBeingEdited, setTaskBeingEdited] = useState(null);

 const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
 const [taskToDelete, setTaskToDelete] = useState(null);


 const handleTaskDelete = async() => {
    
  
  if(taskToDelete)
    {
        setAllTasks((prevTasks) =>
          prevTasks.filter(task =>
              task.id !== taskToDelete.id
          )
      );
    }  

    
    const token ='f402b0ee01be435cc94f15426476f780d16dbd68';
    
    try{

        const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskToDelete.id}`, {
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
                    <Button onClick={()=>showDeleteModal(task)} icon={<DeleteTwoTone twoToneColor='#dc4c3e'/>}/>
                </Space>
            </Flex>
            </Radio>  
        </Space>
        <Divider style={{margin: '0em'}}/>
        </div>
      ))}

      <Modal
        title="Delete task?"
        open={isDeleteModalVisible}
        onOk={handleTaskDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>The <strong>{taskToDelete?.content}</strong> task will be permanently deleted.</p>
      </Modal>
    </div>
  );
};


export default TaskDisplay;