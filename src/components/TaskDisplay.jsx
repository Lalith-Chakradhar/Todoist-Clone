import React,{useState} from "react";
import {Modal, Radio, Button, Flex, Space, Typography, Divider} from "antd";
import {EditOutlined, DeleteTwoTone} from '@ant-design/icons';
import TaskModal from "./TaskModal";
import useCustomContext from '../CustomContext';

const {Text, Paragraph} = Typography;


const TaskDisplay = ({ tasksForParticularProjectId }) => {

 const {editMode, 
  isDeleteModalVisible, 
  handleTaskDelete, 
  taskToDelete, 
  activateEditMode,
  taskBeingEdited,
  showDeleteModal, 
  setIsDeleteModalVisible} = useCustomContext();
 
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