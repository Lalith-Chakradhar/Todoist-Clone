import { Modal, Input, Select, Form, Switch, Segmented} from 'antd';
import { MenuOutlined,
    TableOutlined, 
} from '@ant-design/icons';


import useCustomContext from '../CustomContext';

import { colors } from '../constants/constants';


const ProjectModal = ({editProjectMode,setEditProjectMode}) => {

    const {projectBeingModified,
        isProjectModalVisible,
        setIsProjectModalVisible,
        handleEditProjectDataOk,
        handleProjectCancel, 
        setProjectBeingModified,
        addToFavorites, 
        viewStyle, 
        setView, 
        handleAddProjectOk, 
        addProjectDetails, 
        setAddProjectDetails} = useCustomContext();

    
    
    function editProjectOk(){
        handleEditProjectDataOk(); 
        setEditProjectMode(false);
    } 

    function editProjectCancel(){
        setEditProjectMode(false);
        setIsProjectModalVisible(false);
        setProjectBeingModified(null);
    }
    

  return (
    <>
         {(projectBeingModified && editProjectMode) ? (
            <Modal
                title='Edit'
                open={isProjectModalVisible}
                okText="Save"
                onOk={editProjectOk}
                onCancel= {editProjectCancel}
                okButtonProps={{ danger: true, disabled: projectBeingModified.name.length === 0 }}
            >

                <Form 
                    initialValues={{
                                name : projectBeingModified.name,
                                color: projectBeingModified.color,
                                add_to_favorites: (projectBeingModified.is_favorite) ? true : false,
                                view: projectBeingModified.view_style || 'list'
                            }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your project name!',
                            },
                        ]}
                    >
                        <Input
                            id='projectName'
                            name='name'
                            autoComplete='off'
                            value={projectBeingModified?.name}
                            onChange={(e)=>setProjectBeingModified({...projectBeingModified, name: e.target.value})}
                        />
                    </Form.Item>

                    <Form.Item label="Color" name="color">
                        <Select
                            value={projectBeingModified?.color}
                            options= {colors.map(color => {
                                return {
                                    value: color.toLowerCase().replace(/\s+/g, '_'),
                                    label: color
                                }
                            })}
                            
                            onChange={(value)=>setProjectBeingModified({...projectBeingModified, color: value})}
                        />
                    </Form.Item>

                    <Form.Item label="Add To Favorites" name="add_to_favorites">
                        <Switch 
                            checked={projectBeingModified?.is_favorite || false}
                            onChange={addToFavorites} 
                        />
                    </Form.Item>

                    <Form.Item label="View" name="view">
                            <Segmented
                                value={viewStyle}
                                onChange={setView}
                                options={[
                                    {
                                    label: 'List',
                                    value: 'list',
                                    icon: <MenuOutlined />,
                                    },
                                    {
                                    label: 'Board',
                                    value: 'board',
                                    icon: <TableOutlined />,
                                    },
                                ]}
                            />
                    </Form.Item>
                </Form>
            </Modal>

            ) : (
            <Modal
                title='Add Project'
                okText="Add Project"
                open={isProjectModalVisible}
                onOk={handleAddProjectOk}
                onCancel= {handleProjectCancel}
                okButtonProps={{ danger: true, disabled: addProjectDetails.name.length === 0 }}
            >

                <Form
                    initialValues={{
                        color: 'charcoal', // Set the initial value for color
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your project name!',
                            },
                        ]}
                    >
                        <Input
                            id='newProjectName'
                            name='name'
                            autoComplete='off'
                            value={addProjectDetails?.name}
                            onChange={(e)=>setAddProjectDetails({...addProjectDetails, name: e.target.value})}
                        />
                    </Form.Item>

                    <Form.Item label="Color" name="color">
                        <Select
                            value={addProjectDetails?.color || 'charcoal'}
                            options= {colors.map(color => {
                                return {
                                    value: color.toLowerCase().replace(/\s+/g, '_'),
                                    label: color
                                }
                            })}
                            
                            onChange={(value)=>setAddProjectDetails({...addProjectDetails, color: value})}
                        />
                    </Form.Item>

                    <Form.Item label="Add To Favorites" name="add_to_favorites">

                        <Switch 
                            checked={addProjectDetails?.is_favorite}
                            onChange={addToFavorites} />
                        
                    </Form.Item>

                    <Form.Item label="View" name="view">
                            <Segmented
                                value={viewStyle}
                                onChange={setView}
                                options={[
                                    {
                                    label: 'List',
                                    value: 'list',
                                    icon: <MenuOutlined />,
                                    },
                                    {
                                    label: 'Board',
                                    value: 'board',
                                    icon: <TableOutlined />,
                                    },
                                ]}
                            />
                    </Form.Item>
                </Form>
            </Modal>)}
    </>
  )
}

export default ProjectModal