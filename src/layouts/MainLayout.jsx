 import { Outlet } from 'react-router-dom';
import { Splitter, Menu, ConfigProvider, Modal } from 'antd';
import { PlusCircleFilled, 
    SearchOutlined, 
    InboxOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    EllipsisOutlined,
} from '@ant-design/icons'; 

import { Link } from 'react-router-dom';
import { useState } from 'react';

import useCustomContext from '../CustomContext';
import TaskModal from '../components/TaskModal';
import ProjectModal from '../components/ProjectModal';



const MainLayout = () => {
    const {showModal, 
        allProjects,
        setIsProjectModalVisible,
        projectBeingModified,
        setProjectBeingModified,
        showProjectModal,
        handleDeleteProject, 
        makeFavoriteOrUnfavorite} = useCustomContext();


    const [editProjectMode, setEditProjectMode] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    

    const showDeleteModal = (project) => {
        setProjectToDelete(project);
        setIsDeleteModalVisible(true);
    };
    
    const confirmDelete = () => {
        if (projectToDelete) {
            handleDeleteProject(projectToDelete.id);
            setIsDeleteModalVisible(false);
            setProjectToDelete(null);
        }
    };
    

    const items = [
        {
            key: '1',
            icon: <PlusCircleFilled style={{color: '#dc4c3e', fontSize: '1.2rem'}}/>,
            label: 'Add task',
            onClick: showModal, // Trigger the modal on click
        },
        {
            key: '2',
            icon: <SearchOutlined />,
            label: 'Search',
        },
        {
            key: '3',
            icon: <InboxOutlined />,
            label: 'Inbox',
        },
        {
            key: '4',
            icon: <CalendarOutlined />,
            label: 'Today',
        },
        {
            key: '5',
            icon: <CalendarOutlined />,
            label: 'Upcoming',
        },
        {
            key: '6',
            icon: <AppstoreOutlined />,
            label: 'Filters & Labels',
        },
        {
            key: '7',
            icon: <CheckCircleOutlined />,
            label: 'Completed',
        },
    ];


    const handleEditProject = (id) => {

        if(projectBeingModified)
        {
            setProjectBeingModified(null);
        }

        setProjectBeingModified(allProjects.find((project) => project.id === id));

        setIsProjectModalVisible(true);
        setEditProjectMode(true);
    }
    
    const favoriteItems =[
        {
            key: '1',
            label: 'Favorites',
            children: allProjects?.map((project)=> {
                
                const projectOperations = [
                    {
                        key: '1', 
                        icon: <EllipsisOutlined />,
                        children: [
                            {
                                key: '2',
                                label: 'Edit project',
                                onClick: ()=> handleEditProject(project.id)
                            },
                            {
                                key: '3', 
                                label: 'Delete project',
                                onClick: ()=>showDeleteModal(project)
                            },
                            { 
                                key: '4', 
                                label: 'Mark as Unfavorite',
                                onClick: ()=> makeFavoriteOrUnfavorite(project.id)
                            }
                        ]
                    }
                ]

                return (
                    (project.is_favorite) &&
                    ({
                     key: project.id,
                     label: (
                        <div style={{width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        itemHoverBg: '#ffefe5',
                                        itemSelectedBg: '#ffefe5',
                                        itemSelectedColor: '#dc4c3e',
                                        itemBg: 'none'
                                    },
                                },
                            }}
                            >
                          <Link to={`/project/${project.id}`}><div># {project.name}</div></Link>
                          <div>
                          <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        itemHoverBg: '#ffefe5',
                                        itemSelectedBg: '#ffefe5',
                                        itemSelectedColor: '#dc4c3e',
                                        itemBg: 'none'
                                    },
                                },
                            }}
                            >
                                <Menu  mode="vertical" items={projectOperations}/>
                            </ConfigProvider>
                            </div>
                          </ConfigProvider>
                        </div>
                      ),
                    })
                )
            })
        }
    ]

    const projectItems = [
        {
            key: '1',
            label: 'My Projects',
            children: allProjects?.map((project)=> {
                
                const projectOperations = [
                    {
                        key: '1', 
                        icon: <EllipsisOutlined />,
                        children: [
                            {
                                key: '2',
                                label: 'Edit project',
                                onClick: ()=> handleEditProject(project.id)
                            },
                            {
                                key: '3', 
                                label: 'Delete project',
                                onClick: ()=>showDeleteModal(project)
                            },
                            project.is_favorite 
                            ? { key: '4', label: 'Mark as Unfavorite' , onClick: ()=> makeFavoriteOrUnfavorite(project.id)}
                            : { key: '5', label: 'Mark as Favorite', onClick: ()=> makeFavoriteOrUnfavorite(project.id)},
                        ]
                    }
                ]

                
                return (
                    {
                     key: project.id,
                     label: (
                         
                        <div style={{width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                        <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        itemHoverBg: '#ffefe5',
                                        itemSelectedBg: '#ffefe5',
                                        itemSelectedColor: '#dc4c3e',
                                        itemBg: 'none'
                                    },
                                },
                            }}
                            >
                          <Link to={`/project/${project.id}`}><div># {project.name}</div></Link>
                          <div>
                          <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        itemHoverBg: '#ffefe5',
                                        itemSelectedBg: '#ffefe5',
                                        itemSelectedColor: '#dc4c3e',
                                        itemBg: 'none'
                                    },
                                },
                            }}
                            >
                                <Menu  mode="vertical" items={projectOperations}/>
                            </ConfigProvider>
                            </div>

                            </ConfigProvider>
                        </div>
                      )
                    })

                })
        },
        {
            key: '2',
            label: 'Add Project',
            onClick: showProjectModal,
        },
    ]
    
    

    return (
        <>
        <ConfigProvider
            theme={{
                components: {
                Menu: {
                    itemHoverBg: '#ffefe5',
                    itemSelectedBg: '#ffefe5',
                    itemSelectedColor: '#dc4c3e'
                },
                },
            }}
            >
            <Splitter
                style={{
                    height: '90vh',
                }}
                >
                <Splitter.Panel defaultSize="20%" min="15%" max="25%" className='h-screen bg-vista-white'>
                    
                    <Menu items={items} className='mt-6 bg-vista-white hover:nth'/>
                    <Menu  mode="inline" items={favoriteItems} className='mt-6 bg-vista-white'/>
                    <Menu  mode="inline" items={projectItems} className='mt-6 bg-vista-white'/>

                </Splitter.Panel>

                <Splitter.Panel>
                    <Outlet />
                </Splitter.Panel>
            </Splitter>
            
            <TaskModal />
            <ProjectModal editProjectMode={editProjectMode} setEditProjectMode={setEditProjectMode}/>
            </ConfigProvider>

            <Modal
                title="Delete project?"
                open={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                <p>The <strong>{projectToDelete?.name}</strong> project and all of its tasks will be permanently deleted.</p>
            </Modal>
        </>
    );
};

export default MainLayout;
