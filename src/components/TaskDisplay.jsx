import React from "react";
import {Modal, Radio, Button, Flex, Space, Typography, Divider} from "antd";
import {EditOutlined, DeleteTwoTone} from '@ant-design/icons';
import TaskModal from "./TaskModal";

import { useSelector, useDispatch } from 'react-redux';
import { setTaskModalVisible, 
  setTaskBeingEdited,
  setEditMode,
  setTaskToDelete,
  setDeleteModalVisible,
  deleteTask } from '../features/tasks/taskSlice';

const {Text, Paragraph} = Typography;


const TaskDisplay = ({ tasksForParticularProjectId }) => {


  const dispatch = useDispatch();
  const { taskBeingEdited, editMode, isDeleteModalVisible, taskToDelete } = useSelector(state => state.task);


  const activateEditMode = (task) => {
    dispatch(setEditMode(true));
    dispatch(setTaskBeingEdited(task));
    dispatch(setTaskModalVisible(true));
  };

  const showDeleteModal = (task) => {
    dispatch(setTaskToDelete(task));
    dispatch(setDeleteModalVisible(true));
  };

  const handleTaskDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id)); 
      dispatch(setTaskToDelete(null));
      dispatch(setDeleteModalVisible(false));
    }
  };

 
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
                    {editMode && taskBeingEdited?.id === task.id &&  (<TaskModal/>)}
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
        onCancel={() => dispatch(setDeleteModalVisible(false))}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>The <strong>{taskToDelete?.content}</strong> task will be permanently deleted.</p>
      </Modal>
    </div>
  );
};


export default TaskDisplay;