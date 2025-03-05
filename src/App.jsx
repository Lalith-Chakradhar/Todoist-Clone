import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';

import {Provider} from 'react-redux';
import store from './app/store';


function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout/>}>
        <Route index element={<HomePage/>}/> 
         <Route path='/project/:id' element={<ProjectPage/>}/>
      </Route>
    )
  );

  return (<Provider store={store}>
            <RouterProvider router={router}/>
          </Provider>);
}

export default App;
