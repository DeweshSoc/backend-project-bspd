
# Identity Reconciliation
ref - [Bitespeed Backend Task - Identity Reconciliation](https://drive.google.com/file/d/1m57CORq21t0T4EObYu2NqSWBVIP4uwxO/view)

A web service to identify and keep track of a customer's identity across multiple purchases. 

## API Reference

For comprehensive documentation visit - 
<a href="https://backend-project-bspd.onrender.com/api-docs/" target="_blank">Identity Reconciliation API doc</a>

### Servers: 
- Remote - ``https://backend-project-bspd.onrender.com``
- Local -  ``http://localhost:5000``

IMPORTANT - choose remote server when using the api documentation to try out endpoints


## Endpoint 1
#### Get consolidated data of customer after multiple purchases

```http
  POST /identify
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | Must be a valid email |
| `phoneNumber`      | `number` | Must be a valid phone number |

RETURNS :  Consolidated JSON payload based on below interface

```typescript
interface IIdentityReconciliation {
    contact: {
        primaryContactId: Number;
        emails:string[];
        phoneNumbers:string[];
        secondaryContactIds:Number[];
    };
}
```


## SIDE NOTES
- It took me 18 hours to complete. No regrets, had fun.
- Used AWS RDS (mySql) for db and Node (express) with typescript to build the service.
- Biggest challenge -> thinking through the different cases and getting  mySql workbench to connect to my rds. (was not a cakewalk for me)
- Hosted on render for free (there may be upto 1 min delay on first few requests)
- Thankyou whoever designed the challenge. I learnt a lot.


## Run Locally

Clone the project

```bash
  git clone https://github.com/DeweshSoc/backend-project-bspd.git
```

Go to the project directory

```bash
  cd backend-project-bspd
```

Install dependencies

```bash
  npm install .
```

Start the server

```bash
  npm run start
```
``Server available at http://localhost:5000``




## Authors

- [@deweshsoc](https://www.linkedin.com/in/dewesh-jha/)

