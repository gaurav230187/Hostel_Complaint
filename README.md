Hostel COmplaint System 

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to digitize and manage the grievance redressal process in a college hostel. This system provides separate interfaces for students and wardens to handle complaints efficiently.

Features

    JWT Authentication: Secure user registration and login using JSON Web Tokens.

    Role-Based Access Control:

        Student: Can register, log in, submit new complaints, and view the status of their own complaints.

        Warden: Can log in, view all complaints submitted for their specific block, mark complaints as "Completed," and delete complaints.

    Dynamic Dashboard: The dashboard view changes based on whether the logged-in user is a student or a warden.

    Complaint Management: Full CRUD (Create, Read, Update, Delete) functionality for managing grievances.

    User Profiles: A dedicated "Account" page for users to view their profile details.

Tech Stack

    Frontend:

        React.js

        React Router

        Tailwind CSS

    Backend:

        Node.js

        Express.js

    Database:

        MongoDB (with Mongoose)

    Authentication:

        JSON Web Tokens (JWT)

        bcryptjs for password hashing
