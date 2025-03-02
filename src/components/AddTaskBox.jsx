import React from 'react';

import { Space, Input, Form, Divider, Dropdown, DatePicker, Select, Flex, Button} from 'antd';
import useCustomContext from '../CustomContext';

import { priorityLabels } from '../constants/constants';


const AddTaskBox = ({setShowAddTaskBox}) => {

    const {
        addTask, 
        handleTaskOk,
        allProjects, 
        setAddTask
        } = useCustomContext();


    const handleTaskChange = (e) => {
        const { name, value } = e.target;

            setAddTask((prevState) => ({
                ...prevState,
                [name]: value,
              }));
      };
    
      const handleDateChange = (_, dateString) => {

            setAddTask((prevState) => ({
                ...prevState,
                Date: dateString,
              }));
      };

    const handleMenuClick = (e) => {

            setAddTask((prevState) => ({
                ...prevState,
                Priority: e.key,
              }));
        
      };

      const handleProjectChange = (value) => {

            setAddTask((prevState) => ({
                ...prevState,
                Project_id: value
              }));
        
      };


      const handleAddTaskOk = () => {
        handleTaskOk();
        setShowAddTaskBox(false);
      }

  return (
    <div>
        <Space style={{width:'70%', marginBottom: '1em'}}>
            <Flex style={{width:'42vw', marginTop: '2em', border: '1px solid lightgray', borderRadius: '10px', padding: '1em'}} justify={'space-between'} align={'start'}> 
                    <Form layout="vertical" style={{ width: '100%' }}> 
                        <Form.Item style={{marginBottom: 0}}>
                            <Input 
                                name="taskName"
                                value={addTask.taskName} 
                                onChange={handleTaskChange} 
                                placeholder="Enter the Task title"
                                variant="borderless"
                                size="large"
                                style={{paddingLeft: 0, fontSize: '1.2rem', fontWeight: '600'}}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Input
                                name="taskDescription"
                                value={addTask.taskDescription} 
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
                                        {addTask.Priority ? `Priority ${addTask.Priority}` : "Priority"}
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
                                    placeholder="Project"
                                    onChange={handleProjectChange}
                                    options={allProjects?.map((project) => ({
                                        value: project.id,
                                        label: project.name,
                                    }))}
                                />
                            </Form.Item>
                            
                        
                            <Form.Item>
                                <Button onClick={() => setShowAddTaskBox(false)}>Cancel</Button>
                                <Button 
                                type="primary" 
                                onClick={handleAddTaskOk} style={{marginLeft: '1em'}} 
                                disabled={addTask.taskName.length === 0}
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