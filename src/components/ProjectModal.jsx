import { Modal, Input, Select, Form, Switch, Segmented} from 'antd';
import { MenuOutlined,
    TableOutlined, 
} from '@ant-design/icons';

import useCustomContext from '../CustomContext';


const ProjectModal = ({editProjectMode,setEditProjectMode}) => {

    const {projectBeingModified,
        isProjectModalVisible,
        handleEditProjectDataOk,
        handleProjectCancel, 
        setProjectBeingModified, 
        addToFavorites, 
        viewStyle, 
        setView, 
        handleAddProjectOk, 
        addProjectDetails, 
        setAddProjectDetails} = useCustomContext();

    const colors = [
            'Berry Red', 'Red', 'Orange', 'Yellow', 'Olive Green', 'Lime Green', 'Green',
            'Mint Green', 'Teal', 'Sky Blue', 'Light Blue', 'Blue', 'Grape', 'Violet',
            'Lavender', 'Magenta', 'Salmon', 'Charcoal', 'Grey', 'Taupe'
        ];
    
        
  return (
    <>
         {(projectBeingModified && editProjectMode) ? (
                <Modal
                title={'Edit Project'}
                open={isProjectModalVisible}
                onOk={()=>{handleEditProjectDataOk(); setEditProjectMode(false)}}
                onCancel= {()=>{handleProjectCancel(); setEditProjectMode(false)}}
            >

            <Form  initialValues={
                        {
                            name : projectBeingModified.name,
                            color: projectBeingModified.color,
                            add_to_favorites: (projectBeingModified.is_favorite) ? true : false,
                            view: projectBeingModified.view_style || 'list'
                        }
                    }
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
                        onChange={(e)=>setProjectBeingModified({...projectBeingModified, name: e.target.value})}
                        />
                </Form.Item>

                <Form.Item
                    label="Color"
                    name="color">
                    <Select
                        options= {colors.map(color => {
                            return {
                                value: color.toLowerCase().replace(/\s+/g, '_'),
                                label: color
                            }
                        })}
                        
                        onChange={(value)=>setProjectBeingModified({...projectBeingModified, color: value})}
                        />
                </Form.Item>

                <Form.Item
                    label="Add To Favorites"
                    name="add_to_favorites"
                    >

                    <Switch onChange={addToFavorites} />
                      
                </Form.Item>

                <Form.Item
                    label="View"
                    name="view"
                      >

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
                open={isProjectModalVisible}
                onOk={handleAddProjectOk}
                onCancel= {handleProjectCancel}
            >

            <Form  initialValues={
                 {
                    color: 'charcoal', // Set the initial value for color
                }
                }>
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
                        onChange={(e)=>setAddProjectDetails({...addProjectDetails, name: e.target.value})}
                        />
                </Form.Item>

                <Form.Item
                    label="Color"
                    name="color">
                    <Select
                        options= {colors.map(color => {
                            return {
                                value: color.toLowerCase().replace(/\s+/g, '_'),
                                label: color
                            }
                        })}
                        
                        onChange={(value)=>setAddProjectDetails({...addProjectDetails, color: value})}
                        />
                </Form.Item>

                <Form.Item
                    label="Add To Favorites"
                    name="add_to_favorites"
                    >

                    <Switch onChange={addToFavorites} />
                      
                </Form.Item>

                <Form.Item
                    label="View"
                    name="view"
                      >

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