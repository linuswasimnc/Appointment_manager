# Nbyula-Assignment

## Nbyula Takeaway Assignment 1 ( Appointment Manager )

ASSIGNMENT NO : 1 Appointment manager that allows Terraformers to schedule appointments/meetings easily

## Features

- Terraformers can login and signup on the application
- Terraformers can set their off hours
- Terraformers can schedule an appointment with other Terraformers on application
  - Appointment will contain `title`, `agenda`, `time`, `guests` (other Terraformers)
  - Appointment will not be scheduled if any Terraformers are off during the time slot
- Terraformers can view their appointments on the application
- Terraformers can update their `password` and `name` on the application
- Terraformers can delete appointments
- Terraformers can logout of the application

## Plus point's

- Proper authentication with access and refresh tokens
- User will be automatically redirected to login page if they are not logged in
- There are option for Date, Week and Month for calender
- Verification email on signup and forgot password 

  ![verify email](https://user-images.githubusercontent.com/69336518/190984135-3167b390-dc8e-4e5a-a0e1-253e23d57671.png)

- Proper feedback to the user on the frontend like loading, error messages.
- When new appointment is created, all the guests will get a notification email

  ![appointment notification](https://user-images.githubusercontent.com/63435960/191002162-5c39bbf5-4b9f-47d8-9827-2b84b242c479.png)

- Only organizer can delete the appointment for everyone

## Tech Stack

- Server
  - Node js
  - Express
  - MongoDB
  - mongoose
  - bcrypt (hashing passwords)
  - zod (request validation)
  - nodemailer (sending emails)
  - moment (managing dates)
  - jsonwebtoken (signing JWT tokens)
- Client
  - React
  - Redux/Redux toolkit
  - Ant design
  - Tailwind css
  - Axios
  - moment (managing dates)
  - React big calender (calender)

## Links



## Demo

- Authentication

  - Signup

  ![Signup](https://user-images.githubusercontent.com/63435960/191005272-94bafc57-e88c-4f3b-919d-8559124db37f.gif)

  - Login

  ![Login](https://user-images.githubusercontent.com/63435960/191005443-e98daabe-abc8-4d28-8fb5-bd29193ff509.gif)

  - Forgot/Change Password (user can change password from home page also)

  ![Forgot password/Change Password](https://user-images.githubusercontent.com/63435960/191006644-e42b880f-658c-453a-bf67-36653df30f7e.gif)

- Appointments

  - user can create new Appointment

  ![create appointment](https://user-images.githubusercontent.com/63435960/191008076-5592e4d0-bf22-4689-af1f-685f0c7dbe21.gif)

  John Doe will be notified by email that a new appointment is scheduled with him

  ![notification](https://user-images.githubusercontent.com/63435960/191008324-23c6a404-e1c6-40a6-849d-642fe54d99e0.png)

  - user can block their time

  ![Block time](https://user-images.githubusercontent.com/63435960/191008589-8bfec765-3d7d-4f53-9973-b42065a17bca.gif)

  - If John Doe try to create an appointment with arpit during his blocked time he be shown a error

  ![Blocked time](https://user-images.githubusercontent.com/63435960/191008922-cf171c72-f931-4b96-9ca3-f44997689102.gif)

  - User can view the appointment by clicking on it

  ![View appointment](https://user-images.githubusercontent.com/63435960/191009758-b2f2e317-80e7-4073-a1f9-67613f49b78c.png)

  - Only organizer can see the delete button

  ![Delete only for organizer](https://user-images.githubusercontent.com/63435960/191010140-4a9401d5-91d0-44b8-a873-39489f9eafab.png)

  - Delete Appointment

  ![Delete](https://user-images.githubusercontent.com/63435960/191010514-b514a044-55f8-423c-8b41-56644748313c.gif)

  Appointment will be deleted for all guests

  ![Delete for john doe](https://user-images.githubusercontent.com/63435960/191010687-d9a0ba7b-cad0-4923-b0b9-239d878d5e2a.png)

- Change Name

![Change name](https://user-images.githubusercontent.com/63435960/191011213-595aa863-a433-48f1-bf9d-5a8edcb4c36c.gif)
# Nbyula-Assignment
