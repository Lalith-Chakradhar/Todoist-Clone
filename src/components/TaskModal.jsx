import { Modal, Input, Form, Dropdown, DatePicker, Select, Flex, Button, Typography} from 'antd';
import {useEffect} from 'react';
import useCustomContext from '../CustomContext';
import { v4 as uuidv4} from 'uuid';

const TaskModal = ({editMode, setEditMode, taskBeingEdited, setTaskBeingEdited}) => {

    const {isModalOpen, setIsModalOpen, addTask, handleTaskOk, handleTaskCancel,allProjects, setAddTask, fetchProjects, allTasks, fetchTasks, setAllTasks} = useCustomContext();


    const handleChange = (e) => {
        const { name, value } = e.target;

        if(editMode)
        {
            setTaskBeingEdited((prevState) => ({
                ...prevState,
                [name]: value,
              }));
        }
        else
        {
            setAddTask((prevState) => ({
                ...prevState,
                [name]: value,
              }));
        }
      };
    
      const handleDateChange = (_, dateString) => {

        if(editMode)
        {
            setTaskBeingEdited((prevState) => ({
                ...prevState,
                deadline: {
                    ...prevState.deadline,
                    date: dateString
                }
                }));
        }
        else
        {
            setAddTask((prevState) => ({
                ...prevState,
                Date: dateString,
              }));
        }

      };

    const handleMenuClick = (e) => {

        if(editMode)
        {
            setTaskBeingEdited((prevState) => ({
                ...prevState,
                priority: e.key,
            }));
        }
        else
        {
            setAddTask((prevState) => ({
                ...prevState,
                Priority: e.key,
              }));
        }
        
      };

      const handleProjectChange = (value) => {

        if(editMode)
        {
            setTaskBeingEdited((prevState)=> ({
                ...prevState,
                project_id: value
            }))
        }
        else
        {
            setAddTask((prevState) => ({
                ...prevState,
                Project_id: value
              }));
        }
        
      };

      useEffect(() => {
          fetchProjects();
        }, []);

    const items = [
        { label: "Priority 1", key: "1" },
        { label: "Priority 2", key: "2" },
        { label: "Priority 3", key: "3" },
        { label: "Priority 4", key: "4" },
      ];
    

      const handleEditTaskOk = async() => {


        setAllTasks((prevTasks) =>
            prevTasks.map(task =>
                task.id === taskBeingEdited.id ? { ...task, ...taskBeingEdited } : task
            )
        );

        
        const token ='f402b0ee01be435cc94f15426476f780d16dbd68';


        try{

            const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskBeingEdited.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuidv4(),
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskBeingEdited)
              });

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
    <>
    {(editMode && taskBeingEdited)? 
    (
        <Modal 
                open={isModalOpen}
                onOk={handleEditTaskOk}
                onCancel={handleEditTaskCancel}
                okText="Save"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <Form layout="vertical"> 
                    <Form.Item style={{marginBottom: 0}}>
                        <Input 
                            name="content"
                            value={taskBeingEdited.content} 
                            onChange={handleChange} 
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
                            onChange={handleChange} 
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
                                items,
                                onClick: handleMenuClick,
                            }}
                            trigger={["click"]}
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
                            onChange={handleProjectChange}
                            options={allProjects?.map((project) => ({
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
                open={isModalOpen}
                onOk={handleTaskOk}
                onCancel={handleTaskCancel}
                okText="Add Task"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <Form layout="vertical"> 
                    <Form.Item style={{marginBottom: 0}}>
                        <Input 
                            name="taskName"
                            value={addTask.taskName} 
                            onChange={handleChange} 
                            placeholder="Enter the Task title"
                            variant="borderless"
                            size="large"
                            style={{paddingLeft: 0, fontSize: '1.2rem', fontWeight: '600' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Input
                            name="taskDescription"
                            value={addTask.taskDescription} 
                            onChange={handleChange} 
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
                                items,
                                onClick: handleMenuClick,
                            }}
                            trigger={["click"]}
                            >
                            <Button onClick={(e) => e.preventDefault()}> 
                                {addTask.Priority ? `Priority ${addTask.Priority}` : "Priority"}
                            </Button>
                            </Dropdown>
                        </Form.Item>
                        
                        </Flex>

                        <Form.Item name='project'>
                        <Select
                            style={{
                                width: 120,
                            }}
                            placeholder="Project"
                            onChange={handleProjectChange}
                            options={allProjects?.map((project) => ({
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

export default TaskModal