# React configuration 

This repository it about configuration a React app includes:
 - Project Structure
 - Authentication
 - Routing
 - ...

## Usage

### 1: Install 

#### 1.1: Down load [node.js](https://nodejs.org/en/download) (If you not install node.js yet)

#### 1.2:Clone and running repo [ASP.NET API](https://github.com/hiuhihi78/asp.net-api-configuration) to use this project

### 2: Project Structure

   ```diff
     my-app
     ├── public
     ├── node_modules
   + └── src
           ├── api
           ├── assets
           ├── components
           ├── constants
           ├── pages
           ├── routes
           ├── utils
           ├── App.js
           ├──index.js
           ├──.babelrc
           ├──.env
           ├── package.json

   ```
 #### 2.1: Api folder :This is to config api
    	   			
 ```diff			
 api
     ├── refreshToken 
     ├── user 
     ├── role
     ├── defaultApi.js

 ```
- defaultApi.js it help to config api method (GET, PUT, POST, DELETE) with auth or unauth
- And other folder like user, role, refreshtoken, it corresponding with your controller api in back-end
- If you have other controller api like "customer". So that you can create new folder with name "customer" and define all api in this controller

#### 2.2: Routes folder :This folder to config routing pages in react app
```diff			
routes
     ├── Auth.js
     ├── index.js
     ├── Routing.js
 ```
##### 2.2.1 : index.js : This file it config all routes in app
``` javascript
const routesConfig = [
    {
        title: 'login',
        path: '/login',
        component: <Login />,
    },
    {
        title: 'accessDenied',
        path: '/accessDenied',
        layout: <NormalLayout />,
        component: <AccessDenied />,
    },
    {
        title: 'home',
        path: '/home',
        layout: <NormalLayout />,
        component: <Home />,
    },
    {
        title: 'admin',
        path: '/admin',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, USER_ROLE],
        routes: [
            {
                path: 'dashboard',
                component: <DashBoard />,
            },
            {
                path: 'users',
                component: <Users />,
            },
            {
                path: 'users/:id',
                component: <Detail />,
            },
            {
                path: 'notificaions',
                component: <Notificaion />,
            },
        ],
    },
];
```
- In this file was define a array "routesConfig" and each element define a route in app
- Property in object element:
	+ title (optional): route's name (string)
	+ path(*) : route's path (string)
  + layout(optional): route's layout (function component)
  + component(*) : route's content (function component)
  + role(optional) : what user can visit this route (string[])
  + routes : defile route's childs in this route (object[])
  
##### 2.2.2 : Routing.js : This file config routing and authorization in app
(You not need to modify this file)
##### 2.2.3 : Auth.js : This file config authentication in app
- In this project I was use [cookie-base authentication](https://stackoverflow.com/questions/17769011/how-does-cookie-based-authentication-work)
- If you want to use [token-base authentication](https://www.okta.com/identity-101/what-is-token-based-authentication/) you need to read [React auth kit](https://authkit.arkadip.dev/installation/) library to use.

### 3: Contributors 
- [hiuhihi78](https://github.com/hiuhihi78)
- [tienpmw](https://github.com/tienpmw)
- [hieunv](https://github.com/nepo2111)
