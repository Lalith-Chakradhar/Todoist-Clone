import { Modal, Input, Form, Dropdown, DatePicker, Select} from 'antd';
import {useEffect} from 'react';
import useCustomContext from '../CustomContext';

const TaskModal = () => {

    const {isModalOpen, addTask, handleTaskOk, handleTaskCancel,allProjects, setAddTask, fetchProjects} = useCustomContext();


    const handleChange = (e) => {
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

      useEffect(() => {
          fetchProjects();
        }, []);

    const items = [
        { label: "Priority 1", key: "1" },
        { label: "Priority 2", key: "2" },
        { label: "Priority 3", key: "3" },
        { label: "Priority 4", key: "4" },
      ];

  return (
    <>
    <Modal 
                open={isModalOpen}
                onOk={handleTaskOk}
                onCancel={handleTaskCancel}
                okText="Add Task"
                cancelText="Cancel"
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
                            style={{paddingLeft: 0}}
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
                        <a onClick={(e) => e.preventDefault()}> 
                            {addTask.Priority ? `Priority ${addTask.Priority}` : "Priority"}
                        </a>
                        </Dropdown>
                    </Form.Item>

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
    </>
  )
}

export default TaskModal