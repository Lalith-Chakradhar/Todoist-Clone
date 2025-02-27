 import { Outlet } from 'react-router-dom';
import { Splitter, Menu} from 'antd';
import { PlusCircleFilled, 
    SearchOutlined, 
    InboxOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    EllipsisOutlined 
} from '@ant-design/icons'; 

import { Link } from 'react-router-dom';

import useCustomContext from '../CustomContext';
import TaskModal from '../components/TaskModal';
import ProjectModal from '../components/ProjectModal';



const MainLayout = () => {
    const {showModal, 
        allProjects, 
        showProjectModal,
        handleEditProject, 
        handleDeleteProject, 
        makeFavoriteOrUnfavorite} = useCustomContext();

    const items = [
        {
            key: '1',
            icon: <PlusCircleFilled />,
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
                                onClick: ()=>handleDeleteProject(project.id)
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
                          <Link to={`/project/${project.id}`}><div>{project.name}</div></Link>
                          <div><Menu  mode="vertical" items={projectOperations}/></div>
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
                                onClick: ()=>handleDeleteProject(project.id)
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
                          <Link to={`/project/${project.id}`}><div>{project.name}</div></Link>
                          <div><Menu  mode="vertical" items={projectOperations}/></div>
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
            <Splitter
                style={{
                    height: '90vh',
                }}>
                <Splitter.Panel defaultSize="20%" min="15%" max="25%">
                    
                    <Menu items={items} />
                    <Menu  mode="inline" items={favoriteItems}/>
                    <Menu  mode="inline" items={projectItems}/>

                </Splitter.Panel>

                <Splitter.Panel>
                    <Outlet />
                </Splitter.Panel>
            </Splitter>
            
            <TaskModal />
            <ProjectModal />
 
        </>
    );
};

export default MainLayout;
