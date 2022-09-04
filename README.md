# Documentation

## About the API

This API was specifically made to provide authentication services to the 'Poribar' project.

It has 3 uses only: **login**, **signup**, and **logout**


## Using the API

Here are some guidelines on using the API, covering how it works and what it returns for each path

### [User Model](models/User.js)

The User model contains onyl 3 fields at the moment: `name`, `email`, and `password`.

Whilst sending reponse data, only `name`, `email` will be sent.

### Authentication route(s)

There are 1 route for authentication:

- `/poribar/auth/users/signup`
- `/poribar/auth/users/login`


#### Signup:

Route: `/poribar/auth/users/signup`

Method: `POST`

Send: `name, email, password`

Returns: `"Registered"`

### Login

Route: `/poribar/auth/users/login`

Method: `POST`

Send: `email and password`

Returns: `custom token` 

### Authorization

Present in the auth file, just send the token in the body from the **Client-Side** using `firebase.auth().currentUser.getIdToken(true)` and send the token to the **Server-Side** as a **POST** request in the **Body**
