const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();

app.use(express.json());
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server started at http://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

convertCustomerDbObjectToResponseObject = (dbObject) => {
  return {
    customerId: dbObject.customer_id,
    firstName: dbObject.first_name,
    lastName: dbObject.last_name,
    userName: dbObject.user_name,
    email: dbObject.email,
    phone: dbObject.phone,
    dob: dbObject.dob,
    gender: dbObject.gender,
  };
};

convertAddressDbObjectToResponseObject = (dbObject) => {
  return {
    addressId: dbObject.adress_id,
    customerId: dbObject.customer_id,
    address: dbObject.adress,
    landMark: dbObject.land_mark,
    city: dbObject.city,
    state: dbObject.state,
    country: dbObject.country,
    zipCode: dbObject.zip_code,
  };
};
// get all the customer details  //
app.get("/customers/", async (request, response) => {
  const getCustomersQuery = `select * from customer`;
  const customers = await database.all(getCustomersQuery);
  response.send(convertCustomerDbObjectToResponseObject(customers));
});

// get customer details by customerId  //

app.get("/customers/:customerId", async (request, response) => {
  const { customerId } = request.params;
  const getCustomerById = `select * from customer where customerId = ${customerId} `;
  const customer = await database.get(getCustomerById);
  response.send(convertCustomerDbObjectToResponseObject(customer));
});

app.post("/customers", async (request, response) => {
  const {
    customerId,
    firstName,
    lastName,
    userName,
    email,
    phone,
    dob,
    gender,
    addressId,
    address,
    landMark,
    city,
    state,
    country,
    zipCode,
  } = request.body;
  const postCustomerQuery = `
    insert into customer
        (customer_id,first_name,last_name,user_name,email,phone,dob,gender)
    values 
        (${customerId},'${firstName}','${lastName}','${userName}','${email}',${phone},${dob},'${gender}') `;

  const postAddressQuery = `
     insert into adress
        (customer_id,adress_id,adress,land_mark,city,state,country,zip_code)
     values
        (${customerId},${addressId},'${address}','${landMark}','${city}','${state}','${country}',${zipCode})`;

  await database.run(postCustomerQuery);
  await database.run(postAddressQuery);
  response.send("customer Added successfully");
  response.send("adress added successfully");
});

app.put("customers/:customerId", async (request, response) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    phone,
    gender,
    adress,
    landMark,
    city,
    state,
    country,
    zipCode,
  } = request.body;

  const { customerId } = request.params;
  const updateCustomerQuery = `
    update customer 
        set 
        first_name='${firstName}',last_name='${lastName}',user_name='${userName}',email='${email}',phone=${phone},gender='${gender}'
        where customer_id=${customerId}`;

  const updateAddressQuery = `
    update adress 
        set
        adress='${address}',land_mark='${landMark}',city='${city}',state='${state}',country='${country}',zip_code='${zipCode}'
        where customer_id=${customerId}`;

  await database.run(updateCustomerQuery);
  await database.run(updateAddressQuery);
  response.send("Data updated successfully");
});

app.delete("/customers/", async (request, response) => {
  const { customerId } = request.params;
  const deleteQuery = `delete from customer where customer_id=${customerId}`;
  await database.run(deleteQuery);
  response.send("customer deleted successfully");
});

module.exports = app;
