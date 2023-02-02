import { Op } from "sequelize";

import "./database";

import Customer from "./app/models/Customer";

class Playground {
  static async play() {
    const customer = await Customer.findByPk(1);
    console.log("Antes", JSON.stringify(customer, null, 2));

    const newCustomer = await customer.update({
      name: "joao",
      status: "ACTIVE",
    });
    console.log("Depois:", JSON.stringify(newCustomer, null, 2));
    //console.log(JSON.stringify(customers, null, 2));
  }
}

Playground.play();
