import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import store from './store.js'
import { Provider } from 'react-redux'
import {createBrowserRouter,
       createRoutesFromElements, 
       Route,
       RouterProvider} from 'react-router-dom'
import HomeScreen from './components/screens/HomeScreen.jsx'
import LoginScreen from './components/screens/LoginScreen.jsx'
import RegisterScreen from './components/screens/RegisterScreen.jsx'

       const router = createBrowserRouter(
        createRoutesFromElements(
          <Route path='/' element={<App/>}>
            <Route index={true} path='/' element={<HomeScreen/>}/>
            <Route  path='/login' element={<LoginScreen/>}/>
            <Route  path='/register' element={<RegisterScreen/>}/>
          </Route>
        )
       )

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>,
  </Provider>
)
