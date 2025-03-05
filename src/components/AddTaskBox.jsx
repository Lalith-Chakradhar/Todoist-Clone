import {useState} from 'react';

import { Space, Input, Form, Divider, Dropdown, DatePicker, Select, Flex, Button} from 'antd';

import { priorityLabels } from '../constants/constants';

import { useSelector, useDispatch } from 'react-redux';

import { addTask  } from '../features/tasks/taskSlice';

import { allProjects } from '../features/projects/projectSlice';

const AddTaskBox = ({setShowAddTaskBox}) => {

    const dispatch = useDispatch();

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

        setAddTaskDetails((prevState) => ({
            ...prevState,
            [name]: value,
          }));
      };
    
      const handleDateChange = (_, dateString) => {

        setAddTaskDetails((prevState) => ({
            ...prevState,
            deadline: {date: dateString}
          }));
      };

    const handleMenuClick = (e) => {

        setAddTaskDetails((prevState) => ({
            ...prevState,
            priority: e.key,
          }));
        
      };

      const handleProjectChange = (value) => {

        setAddTaskDetails((prevState) => ({
            ...prevState,
            project_id: value
          }));
        
      };

      
    function handleAddTaskCancel(){

        setShowAddTaskBox(false);

        setAddTaskDetails({
            content: '',
            description: '',
            deadline: { date: null },
            priority: null,
            project_id: null,
        });
    }


      const handleAddTaskOk = () => {

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

        setShowAddTaskBox(false);
      }

  return (
    <div>
        <Space style={{width:'70%', marginBottom: '1em'}}>
            <Flex style={{width:'42vw', marginTop: '2em', border: '1px solid lightgray', borderRadius: '10px', padding: '1em'}} justify={'space-between'} align={'start'}> 
                    <Form layout="vertical" style={{ width: '100%' }}> 
                        <Form.Item style={{marginBottom: 0}}>
                            <Input 
                                name="content"
                                value={addTaskDetails.content} 
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
                        
                        <Divider style={{margin: '0em', marginBottom: '1em'}}/>

                        <Flex justify='space-between' align='center' style={{height: '3.1em'}}>

                            <Form.Item name='project'>
                                <Select
                                    style={{
                                        width: 120,
                                        border: 'none'
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
                            
                        
                            <Form.Item>
                                <Button onClick={handleAddTaskCancel}>Cancel</Button>
                                <Button 
                                type="primary" 
                                onClick={handleAddTaskOk} style={{marginLeft: '1em'}} 
                                disabled={addTaskDetails.content.length === 0}
                                danger>Add Task</Button>
                            </Form.Item>

                        </Flex>
                    </Form> 
            </Flex>
        </Space>
    </div>
  )
}

export default AddTaskBox