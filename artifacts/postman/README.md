<h3 align="center">Guidelines</h3>

1. Execute the request serially to test them quickly. Why serially? Login/Refresh Token/Logout requests are stateful. So it is important to test for one user at a time. Obviously you can mix them to test the exception responses as well. Another reason is that, the variables (POSTMAN environment) are automatically set to make the test easy.

2. Variables are handled using tests in POSTMAN apart from one. CODE is not handled automatically when testing the verify email request. You have to manually collect the code from **http://0.0.0.0:1080** and pass it using the body 
```
{
    "verification_id": "{{blockstak_email_verification_id}}",
    "code": "CODE_GOES_HERE"
}
```