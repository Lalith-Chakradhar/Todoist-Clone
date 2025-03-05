import { Modal, Input, Select, Form, Switch, Segmented} from 'antd';
import { useState } from 'react';
import { MenuOutlined,
    TableOutlined, 
} from '@ant-design/icons';

import { useSelector, useDispatch } from "react-redux";
import {
    addProject,
    projectBeingModified,
    isProjectModalVisible,
    setIsProjectModalVisible,
    setProjectBeingModified,
    updateProject
 } from '../features/projects/projectSlice';


import { colors } from '../constants/constants';


const ProjectModal = ({editProjectMode,setEditProjectMode}) => {

    const dispatch = useDispatch();
    const projectBeingUpdated = useSelector(projectBeingModified);
    const modalVisible = useSelector(isProjectModalVisible);

    const [addProjectDetails, setAddProjectDetails] = useState({
        name: '',
        color: 'charcoal',
        is_favorite: false,
        view: 'list',
    });    

    const handleAddProjectOk = () => {
        if (addProjectDetails.name) {
          dispatch(addProject(addProjectDetails))
            .unwrap()
            .then(() => {
              dispatch(setIsProjectModalVisible(false));
              setAddProjectDetails({
                name: '',
                color: 'charcoal',
                is_favorite: false,
                view: 'list',
              });
            })
            .catch((error) => {
              console.error('Failed to add project:', error);
            });
        }
      };
    
      const handleAddProjectCancel = () => {
        dispatch(setIsProjectModalVisible(false));
        setAddProjectDetails({
          name: '',
          color: 'charcoal',
          is_favorite: false,
          view: 'list',
        });
      };
    
    function editProjectOk(){

        if(projectBeingUpdated)
        {
            dispatch(updateProject({id: projectBeingUpdated.id, updatedData: projectBeingUpdated }))
                .unwrap()
                .then(()=>{
                    dispatch(setIsProjectModalVisible(false));
                    dispatch(setProjectBeingModified(null));
                })
                .catch((error) => {
                    console.error("Failed to update project:", error); 
                });
        }
        setEditProjectMode(false);
    } 

    function editProjectCancel(){ 
        dispatch(setIsProjectModalVisible(false));
        dispatch(setProjectBeingModified(null));
        setEditProjectMode(false);
    }
    
    const handleFieldChange = (field, value) => {
        dispatch(setProjectBeingModified({ ...projectBeingUpdated, [field]: value }));
    };

  return (
    <>
         {(projectBeingUpdated && editProjectMode) ? (
            <Modal
                title='Edit'
                open={modalVisible}
                okText="Save"
                onOk={editProjectOk}
                onCancel= {editProjectCancel}
                okButtonProps={{ danger: true, disabled: !projectBeingUpdated.name }}
            >

                <Form 
                    initialValues={{
                                name : projectBeingUpdated.name,
                                color: projectBeingUpdated.color,
                                add_to_favorites: (projectBeingUpdated.is_favorite) ? true : false,
                                view: projectBeingUpdated.view_style || 'list'
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
                            value={projectBeingUpdated?.name}
                            onChange={(e)=>handleFieldChange('name', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Color" name="color">
                        <Select
                            value={projectBeingUpdated?.color}
                            options= {colors.map(color => {
                                return {
                                    value: color.toLowerCase().replace(/\s+/g, '_'),
                                    label: color
                                }
                            })}
                            
                            onChange={(value) => handleFieldChange('color', value)}
                        />
                    </Form.Item>

                    <Form.Item label="Add To Favorites" name="add_to_favorites">
                        <Switch 
                            checked={projectBeingUpdated?.is_favorite || false}
                            onChange={(checked) => handleFieldChange('is_favorite', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="View" name="view">
                            <Segmented
                                value={projectBeingUpdated.view_style}
                                onChange={(value) => handleFieldChange('view_style', value)}
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
                open={modalVisible}
                onOk={handleAddProjectOk}
                onCancel={handleAddProjectCancel}
                okButtonProps={{ danger: true, disabled: addProjectDetails.name.length === 0 }}
            >

                <Form
                    initialValues={{
                        name: addProjectDetails.name,
                        color: addProjectDetails.color,
                        add_to_favorites: addProjectDetails.is_favorite,
                        view: addProjectDetails.view,
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
                            value={addProjectDetails.name}
                            onChange={(e)=>setAddProjectDetails({...addProjectDetails, name: e.target.value})}
                        />
                    </Form.Item>

                    <Form.Item label="Color" name="color">
                        <Select
                            value={addProjectDetails.color}
                            options= {colors.map(color => {
                                return {
                                    value: color.toLowerCase().replace(/\s+/g, '_'),
                                    label: color
                                }
                            })}
                            
                            onChange={(value) => setAddProjectDetails({ ...addProjectDetails, color: value })}
                        />
                    </Form.Item>

                    <Form.Item label="Add To Favorites" name="add_to_favorites">

                        <Switch 
                            checked={addProjectDetails?.is_favorite}
                            onChange={() => setAddProjectDetails({ ...addProjectDetails, is_favorite: !addProjectDetails.is_favorite })}
                            />

                    </Form.Item>

                    <Form.Item label="View" name="view">
                            <Segmented
                                value={addProjectDetails.view}
                                onChange={(value) => setAddProjectDetails({ ...addProjectDetails, view: value })}
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