# Documentation

## About the API

This API was specifically made to provide authentication services to the 'Poribar' project.

It has 3 uses only: **login**, **signup**, and **logout**


## Using the API

Here are some guidelines on using the API, covering how it works and what it returns for each path


- ### User
  - #### User details
    `/api/auth/user/profile/:uid`.  
    Requirements: Pass user uid as params in `:uid`.
    Returns: user details

  - #### User signup
    `/api/auth/user/signup`.
    Requirements: pass user details in body
    Returns: success message user was added

  - #### User profile update
    `/api/auth/user/profile/update/:uid`.
    Requirements: Pass user uid as params in `:uid`.
    Returns: success message
  
  - #### User delete
    `/api/auth/user/profile/remove/:uid`.
    Requirements: Pass user uid as params in `:uid`.
    Returns: success message


- ### Nurse
  - #### Nurse details
    `/api/auth/nurse/profile/:uid`.  
    Requirements: Pass nurse uid as params in `:uid`.
    Returns: nurse details

  - #### Nurse signup
    `/api/auth/nurse/signup`.
    Requirements: pass nurse details in body
    Returns: success message nurse was added

  - #### Nurse profile update
    same as user
  
  - #### Nurse delete
    `/api/auth/nurse/profile/remove/:uid`.
    Requirements: Pass nurse uid as params in `:uid`.
    Returns: success message


