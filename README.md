<h3 align="center">Basic Report Management System (using My Meta Framework)</h3>

---

<p align="center"> Backend for a basic report management system demonstrating core component of a backend system and core concept of a framework. 
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Motivation](#motivation)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Commands](#commands)
- [Challenges](#challenges)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

This project demonstrates a fully working backend to serve the REST API endpoints which may propel an website with basic functionalities for adding and viewing reports. Through this project, you may find reference on developing a backend which utilizes **httponly fingerprint cookie alongside refresh token/bearer token mechanism and session tracking using redis** to be as secure as possible. You can also find reference on a modular backend codebase. This project also includes, **multichannel notification**, **task queue implementation using bull**, **role based authorization**, **validation using zod**, and **unit, integration and end to end testing using jest and docker**. Though these are some aspects of this project, the main takeaway is building a custom framework on top of express js which utilizes meta programming, like NestJs.

## ✊🏼 Motivation <a name = "motivation"></a>

_The major difference between an object-oriented framework and a class library is that the framework calls the application code. Normally the application code calls the class library. This inversion of control is sometimes named the Hollywood principle, “Do not call us, we call You”._ - Michael Mattson

_One important characteristic of a framework is that the methods defined by the user to tailor the framework will often be called from within the framework itself, rather than from the user’s application code. The framework often plays the role of the main program in coordinating and sequencing application activity. This inversion of control gives frameworks the power to serve as extensible skeletons. The methods supplied by the user tailor the generic algorithms defined in the framework for a particular application._ - Ralph E. Johnson and Brian Foote

Framework is not just a tool. It is a set of tools that helps the developer build the software and acts as an orchestrator. But ExpressJs, being a minimalistic framework, lacks the second characteristic. That's why I prefer NestJs over vanilla ExpressJs. 

Speaking of NestJs, they achieved the inversion of control using meta-programming (decorator and reflection) and it always fascinates me. While meta programming is nothing new, it is fairly new in NodeJs and an interesting concept to mid-level developers like me. Also, I like to go deeper on the tools that I use and learn how they works. So, I took some days to imitate some of the core functionalities of NestJs using meta-programming and built a framework on top of ExpressJs. This project is a working prototype on top of my amateur framework.

You can find the code for the framework implementation at **src/core/application**.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [usage](#usage) for how you can see everything in action and interact with the system. 

### Prerequisites

What things you need to run the application
```
docker-compose v2.10.2
```

To run tests using own environment you need
```
node v20.5.0
npm v9.8.0
```

### Installing

A step by step series of examples that tell you how to get a development env running.

Clone this repository

```
git clone https://github.com/theZeuses/BlockStakReportManagementMern.git
```

Change working directory

```
cd my-meta-framework
```

Create a .env file in root and copy everything form .env.example

```
cat .env.example > .env
```

Start the application
```
docker compose up
```
Necessary dependencies will be pulled from NPM and Docker. After successful build the application will boot up. You will be able to access the API server at this point through _http://localhost:8001_. Also you will be able to access to maildev interface through _http://0.0.0.0:1080/_. ***Note that, if you try to access the APIs right after booting up, you can end up having Connection Refused error as docker services need some time to be fully up. So please give it some time before start calling the endpoints.***

## 🔧 Running the tests <a name = "tests"></a>
### Set Up
To run the tests on isolation we will spin up another set of docker services. Run this command to prepare the environment. 

```
npm run test:prepare
```
***Again, please give it some seconds before starting the end-to-end tests as docker services needs some time to be fully up***

### Automated Tests
To run all the unit tests run

```
npm test
```

To run all the integration tests run

```
npm run test:int
```

To run all the end to end test run

```
npm run test:e2e
```

_Note: This project doesn't have much test coverage as the purpose of these tests were to demonstrate how to integrate the tests._

## 🎈 Usage <a name="usage"></a>

As soon as your copy of the application boots up you can start exploring the endpoints. **The base url should be http://localhost:8001 if you haven't change the env.** Here, only the main functionalities have been demonstrated. You can also find a copy of Postman collection in the artifacts folder. You may find additional information there.

### _Clarification_
1. API endpoints have been versioned using /v1 prefix before all resource names.

2. GET requests must follow appropriate query string format described above, otherwise a 400 error will be returned.

3. POST/PATCH request's body must follow appropriate payload schema to fullfil that request, otherwise 400 error will be returned.

4. Successful request for getting resource will just return the result/result set.
```
{
  "field": "data"
}
```
```
[
  {
    "field": "data"
  }
]
```
5. Successful request for performing action may return response in following pattern. Note: _data_ is optional.
```
{
  "success": true,
  "data": {
    "field": "data"
  }
}
```
6. Some Successful request for performing action can return response specific to that request. So it is better to follow contract/documentation for requests that are of action type.

7. Unsuccessful request will return response in following pattern
```
{
    "statusCode": 401,
    "errorCode": 40102,
    "errors": []
}
```

### Auth

**Login**

endpoint
```
POST /v1/auth/login
```
body
```
{
  "email": "test1@test.com",
  "password": "12345678"
}
```

**Login (As Admin)**
_During the first boot up a default admin was created. The first admin should use that Admin account for login have the access of the platform._

endpoint
```
POST /v1/auth/login
```
body
```
{
  "email": "admin@test.com",
  "password": "12345678"
}
```

**Register**

endpoint
```
POST /v1/auth/register
```
body
```
{
    "email": "test1@test.com",
    "name": "test1",
    "password": "12345678",
    "address": "test",
    "phone": "01718827347",
    "profession": "test",
    "favorite_colors": ["test"]
}
```
_After Registration a email containing a otp will be sent to the user Email address. In development, you can find that email at http://0.0.0.0:1080. Without verifying your account you cannot obtain auth tokens._

**Verify Email**
_You need to use the OTP found in the email and verification_code_id obtained from previous step to complete the registration._

endpoint
```
POST /v1/auth/verify-email
```
body
```
{
    "verification_id": "64ffb2adef3598a7780bdc7e",
    "code": "223184"
}
```
_If code doesn't work please create a new account and try again as the code has short expiry time. Keep open http://0.0.0.0:1080 so that you can use the code as soon as it is delivered._

**Note:** _Verifying your account will also log you in. But in general now you are okay to obtain auth tokens from login endpoint._

**Refresh Token**

Bearer tokens must be refreshed before they expire.

endpoint
```
POST /v1/auth/refresh-token
```
headers
```
Authorization: Bearer [refresh_token of USER/ADMIN]
```
body
```
none
```

_A fingerprint cookie will be automatically attached with the request._

**Logout**
endpoint
```
POST /v1/auth/logout
```
headers
```
Authorization: Bearer [refresh_token of USER/ADMIN]
```
body
```
none
```

**Remember that, obtaining auth tokens (Login/verify/refresh) also sets fingerprint cookie for refresh path. Logout invalidates the cookie.**

### Users
**Make a user admin** 
Potential admin registers just like other users. But the registration only records them as a user. And an admin can make a user admin.

endpoint
```
POST /v1/users/:userId/make-admin
```
headers
```
Authorization: Bearer [bearer_token of ADMIN]
```
body
```
none
```

### Reports

**Get Reports**

endpoint
```
GET /v1/reports
```
query
```
limit=10&skip=0
```
headers
```
Authorization: Bearer [bearer_token of USER/ADMIN]
```

**Get Specific Report**

endpoint
```
GET /v1/reports/:reportId
```
headers
```
Authorization: Bearer [bearer_token of USER/ADMIN]
```

**Get Specific Report**

endpoint
```
GET /v1/reports/:reportId
```
headers
```
Authorization: Bearer [bearer_token of USER/ADMIN]
```

**Create a Report**

endpoint
```
POST /v1/reports
```
headers
```
Authorization: Bearer [bearer_token of ADMIN]
```
body
```
{
    "email": "report1@test.com",
    "name": "test",
    "address": "test",
    "phone": "01718827347",
    "profession": "test",
    "favorite_colors": ["test"]
}
```

**Update a Report**

endpoint
```
PATCH /v1/reports/:reportId
```
headers
```
Authorization: Bearer [bearer_token of ADMIN]
```
body
```
{
    "name": "updated report 1",
    "address": "test",
    "phone": "01718827347",
    "profession": "test",
    "favorite_colors": ["test"]
}
```
_Only the provided fields will be updated._

**Delete Specific Report**

endpoint
```
DELETE /v1/reports/:reportId
```
headers
```
Authorization: Bearer [bearer_token of ADMIN]
```

### System functionality
System will send the queued emails using job queue.

## 🚀 Commands <a name = "commands"></a>

There are useful commands that you may find in _package.json_

start the dev server (through docker)
```
docker compose up
```

start the dev server (using own environment setup)
```
npm run dev
```

restart the docker containers
```
npm run d-service:restart
```

spin up the docker containers for test
```
npm run test:prepare
```

perform unit tets
```
npm test
```

perform unit tests and watch for change
```
npm run test:watch
```

perform integration test and watch for changes
```
npm run test:int
```

perform end to end test and watch for changes
```
npm run test:e2e
```

generate test coverage report
```
npm run test:cov
```

## 🤬 Challenges <a name = "challenges"></a>
### Framework
ExpressJs is a minimal framework. But to write clean, testable code some other features are needed. In fact in built IoC handling is the feature that differentiate a framework from a library. So it is better to embrace modern Framework like NestJs. But for this project, I used vanilla ExpressJs. And made a wrapper just like NestJs on top of it to handle framework provided tasks like dependency injection. You can find that custom framework in **src/core/application** folder.

### Zod
Zod requires to have **"strictNullChecks": true** in tsconfig.json. Enabling strictNullChecks suddenly made typescript very aggressive. So it is better to integrate Zod early in the project otherwise a lot of refactoring will be needed if integrated later.

### Mongoose
1. Document returns from mongoose query are sealed object. You cannot delete properties from them. But for this project I needed to be able to that, like deleting password from user object. Yes, there are query specific ways (excluding the field from select) to do that. But I went with application logic handling that in this project. But to be able to delete a properties from a document, you need to first convert it to JS object using toObject() method.

2. For unit testing, mocking the Models were very hard as there is not good tools out for that. So instead of mocking the Models I chose to mock the database itself using **mongodb-memory-server**.

### Typescript
To handle dependency injection I had to pass concrete class some place rather than objects. I had to make some Utils Type to be able to do that.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [Redis](https://redis.io) - Memory Store & Message Broker
- [Jest](https://jestjs.io) - Testing Framework
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@theZeuses](https://github.com/theZeuses) - Idea & Initial work

