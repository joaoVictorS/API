import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import auth from "./app/middlewares/auth";

import sessions from "./app/controllers/SessionsController";
import customers from "./app/controllers/CustomersController";
import contacts from "./app/controllers/ContactsController";
import users from "./app/controllers/UsersController";
import files from "./app/controllers/FillesController";

const routes = new Router();
const upload = multer(multerConfig);

// Sessions
routes.post("/sessions", sessions.create);

// Controlar o acesso
routes.use(auth);

// Customers
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

// Contacts
routes.get("/customers/:customerID/contacts", contacts.index);
routes.get("/customers/:customerID/contacts/:id", contacts.show);
routes.post("/customers/:customerID/contacts", contacts.create);
routes.put("/customers/:customerID/contacts/:id", contacts.update);
routes.delete("/customers/:customerID/contacts/:id", contacts.destroy);

// users
routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.destroy);

// Files
routes.post("/files", upload.single("file"), files.create);

export default routes;
