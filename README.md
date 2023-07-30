# interest-registration-backend-POC
A simple API that takes in usernames and emails and saves to a CF KV database, can be easily integrated with other databases like postgresql.

Accepted request types : POST
Auto verification of duplicate signups with kv lookup
Hosted on cloudflare workers, processing happens close to the user
JSON format for the POST request: 

{
    "firstname" : "input1",
    "lastname" : "input2",
    "email" : "input3"
}