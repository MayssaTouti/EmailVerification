CREATE DATABASE graphqlcrudTest ; 

 CREATE TABLE Simple_User (
  id_user SERIAL PRIMARY KEY ,
  email VARCHAR(255),
  nom  VARCHAR(255),
  password VARCHAR(255), 
  verified boolean DEFAULT 'false'

);


CREATE TABLE role (
  
  role_id SERIAL PRIMARY KEY , 
  role_name VARCHAR(255), 
  role_description VARCHAR(255)
);

 CREATE TABLE utilisateur (
  iduser SERIAL PRIMARY KEY ,
  email VARCHAR(255),
  name VARCHAR(255),
  password VARCHAR(255),
   role_id SERIAL REFERENCES role
);
