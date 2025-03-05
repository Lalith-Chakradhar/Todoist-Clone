import React from "react";
import {Flex, Space, Typography, Divider} from "antd";
import { useSelector } from "react-redux";

const {Text} = Typography;


const CompletedTasksPage = () => {

    const allTasks = useSelector((state) => state.tasks.allTasks);

  return (
    <div className="w-7/12 m-auto mt-32">
        <h1 className="text-3xl font-bold">Completed Tasks</h1>
        {allTasks.map((task) => {

            if(task.is_completed === true)
            {
                return (<div key={task.id}> 
                <Space style={{width:'70%', marginBottom: '1em'}}> 
                    <Flex style={{width:'40vw', marginTop: '2em'}} justify={'space-between'} align={'start'}> 
                        <div>
                            <Text><strong>You</strong> completed a task: {task.content}</Text>
                        </div>
                    </Flex>
                </Space>
                <Divider style={{margin: '0em'}}/>
                </div>)
            }
        })}
    </div>
  )
}

export default CompletedTasksPage;