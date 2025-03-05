import { Modal, Input, Form, Dropdown, DatePicker, Select, Flex, Button} from 'antd';
import { useState } from 'react';

import { priorityLabels } from '../constants/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setTaskModalVisible, 
    setTaskBeingEdited, 
    setEditMode,  
    updateTask,
    addTask  } from '../features/tasks/taskSlice';

import { allProjects } from '../features/projects/projectSlice';

const TaskModal = () => {

    const dispatch = useDispatch();

    const {taskBeingEdited, editMode, isTaskModalOpen} = useSelector(state => state.task);

    const projects = useSelector(allProjects);

     const [addTaskDetails, setAddTaskDetails] = useState({
            content: '',
            description: '',
            deadline: {date: null},
            priority: null,
            project_id: null,
        });    
    

    const handleTaskChange = (e) => {
        const { name, value } = e.target;

        if(editMode)
        {
            dispatch(setTaskBeingEdited({
                ...taskBeingEdited,
                [name]: value,
              }));
        }
        else
        {
            setAddTaskDetails((prevState) => ({
                ...prevState,
                [name]: value,
              }));
        }
      };
    
      const handleDateChange = (_, dateString) => {

        if(editMode)
        {
            dispatch(setTaskBeingEdited({
                ...taskBeingEdited,
                deadline:{ date: dateString }
                }))
        }
        else
        {
            setAddTaskDetails((prevState) => ({
                ...prevState,
                deadline: {date: dateString}
              }));
        }

      };

    const handleMenuClick = (e) => {

        if(editMode)
        {   
            dispatch(setTaskBeingEdited({
                ...taskBeingEdited,
                priority: e.key
            }))
        }
        else
        {
            setAddTaskDetails((prevState) => ({
                ...prevState,
                priority: e.key,
              }));
        }
        
      };

      const handleProjectChange = (value) => {

        if(editMode)
        {
            dispatch(setTaskBeingEdited({
                ...taskBeingEdited,
                project_id: value
            }));
        }
        else
        {
            setAddTaskDetails((prevState) => ({
                ...prevState,
                project_id: value
              }));
        }
        
      };

      function handleEditTaskOk(){
      
            if(taskBeingEdited.content !== '')
            {
                dispatch(updateTask({id: taskBeingEdited.id,  updatedData: taskBeingEdited }))
                    .unwrap()
                    .then(()=>{
                        dispatch(setTaskModalVisible(false));
                        dispatch(setTaskBeingEdited(null));
                    })
                    .catch((error) => {
                        console.error("Failed to update project:", error); 
                    });
            }
            
            dispatch(setEditMode(false));
        } 
      
    function handleEditTaskCancel(){ 
        dispatch(setTaskModalVisible(false));
        dispatch(setTaskBeingEdited(null));
        dispatch(setEditMode(false));
    }

    function handleAddTaskOk(){
        if(addTaskDetails.content !== '')
        {
            dispatch(addTask(addTaskDetails))
                .unwrap()
                .then(()=>{
                    dispatch(setTaskModalVisible(false));
                    setAddTaskDetails({
                        content: '',
                        description: '',
                        deadline: { date: null },
                        priority: null,
                        project_id: null,
                    })
                })
                .catch((error) => {
                    console.error("Failed to update project:", error); 
                });
        }
    }

    function handleAddTaskCancel(){
        dispatch(setTaskModalVisible(false));
        setAddTaskDetails({
            content: '',
            description: '',
            deadline: { date: null },
            priority: null,
            project_id: null,
        });
    }

  return (
    <>
    {(editMode && taskBeingEdited)? 
    (
        <Modal 
                open={isTaskModalOpen}
                onOk={handleEditTaskOk}
                onCancel={handleEditTaskCancel}
                okText="Save"
                cancelText="Cancel"
                okButtonProps={{ danger: true, disabled: !taskBeingEdited.content}}
            >
                <Form layout="vertical"> 
                    <Form.Item style={{marginBottom: 0}}>
                        <Input 
                            name="content"
                            value={taskBeingEdited.content} 
                            onChange={handleTaskChange} 
                            placeholder="Enter the Task title"
                            variant="borderless"
                            size="large"
                            style={{paddingLeft: 0, fontSize: '1.2rem', fontWeight: '600'}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="description"
                            value={taskBeingEdited.description} 
                            onChange={handleTaskChange} 
                            placeholder="Description"
                            variant="borderless"
                            size="small"
                            style={{paddingLeft: 0}}
                        />
                    </Form.Item>

                    <Flex gap="large">
                        <Form.Item>
                            <DatePicker onChange={handleDateChange}/>
                        </Form.Item>

                        <Form.Item>
                            <Dropdown
                                menu={{
                                    items: priorityLabels,
                                    onClick: handleMenuClick,
                                }}
                            >
                                <Button onClick={(e) => e.preventDefault()}> 
                                    {taskBeingEdited.priority ? `Priority ${taskBeingEdited.priority}` : "Priority"}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                        
                        </Flex>
                        
                        <Form.Item>
                        <Select
                            style={{
                                width: 120,
                            }}
                            value={taskBeingEdited.project_id}
                            onChange={handleProjectChange}
                            options={projects?.map((project) => ({
                                value: project.id,
                                label: project.name,
                            }))}
                        />
                        </Form.Item>
                </Form>
    </Modal>
    )
    :
    (
            <Modal 
                open={isTaskModalOpen}
                onOk={handleAddTaskOk}
                onCancel={handleAddTaskCancel}
                okText="Add Task"
                cancelText="Cancel"
                okButtonProps={{ danger: true, disabled: addTaskDetails.content.length === 0 }}
            >
                <Form layout="vertical"> 
                    <Form.Item style={{marginBottom: 0}}>
                        <Input 
                            name="content"
                            value={addTaskDetails.content} 
                            onChange={handleTaskChange} 
                            placeholder="Enter the Task title"
                            variant="borderless"
                            size="large"
                            style={{paddingLeft: 0, fontSize: '1.2rem', fontWeight: '600' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Input
                            name="description"
                            value={addTaskDetails.description} 
                            onChange={handleTaskChange} 
                            placeholder="Description"
                            variant="borderless"
                            size="small"
                            style={{paddingLeft: 0}}
                        />
                    </Form.Item>

                    <Flex gap="large">
                        <Form.Item name='date'>
                            <DatePicker placeholder="Date" onChange={handleDateChange}/>
                        </Form.Item>

                        <Form.Item>
                            <Dropdown
                                menu={{
                                    items: priorityLabels,
                                    onClick: handleMenuClick,
                                }}
                            >
                                <Button onClick={(e) => e.preventDefault()}> 
                                    {addTaskDetails.priority ? `Priority ${addTaskDetails.priority}` : "Priority"}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                        
                        </Flex>

                        <Form.Item name='project'>
                        <Select
                            style={{
                                width: 120,
                            }}
                            value={addTaskDetails.project_id}
                            placeholder="Project"
                            onChange={handleProjectChange}
                            options={projects.map((project) => ({
                                value: project.id,
                                label: project.name,
                            }))}
                        />
                        </Form.Item>
                    
                </Form>
    </Modal>)
    }
    </>
  )
}

export default TaskModal;