# CLIENT SIDE IMPLEMENTATION

## 
### Installation
npm install

### AFTER-INSTALL
node index

PORT **3001*


## IMPLEMENTATION

This is the basic implementation of the problem statement. It is a node-expressjs application that runs on a single-port entry model with three endpoints. One endpoint is shared with a RPS which communicates and dumps json which are inserted into the database (with added author column) only after each entry is verified. If the entry credentials are incorrect, the jsonEntry is dumped and appropriate response is sent back.

The backendapplication also connects to the front-end react application. The react application can connect to the backend, authenticate itself (currently only one single user) and on correct authentication, it permits sending back data which is then showcased by the front-end to the user.

This backend is supposed to work on the AWS and the front-end should also be hosted on AWS. This has been tested on both local machines and AWS. Current AWS implementation will timeout if the network traffic increases beyond a fixed amount. This is to prevent the rest of the services (on the server that are not related to this implementation) from failing. It is a preventive measure, and I apologize for it, however, I cannot remove those safeguards. The error you will get is **ETIMEOUT**. This is not a bug.


## NOTE
If I had to do a few things differently (permissive of time), I would have
* Changed the database schema. I would have introduced an additional schema called userdata, which would act like a foriegn key to the RPSJsonEntry and can be used for authentication
* Added support for Passport.js
* Added NGINX Support so that load is balanced and thus IO transactions between the backend and the database server is improved drastically.
However, the current implementation showcases the overall program flow effectively and with efficiency.

### AUTHOR: ADVAIT AMBESKAR
