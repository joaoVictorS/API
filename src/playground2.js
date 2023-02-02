import { Op } from "sequelize";

import "./database";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
  static async play() {
    const customers = await Customer.findAll({
      include: [
        {
          model: Contact,
          where: {
            status: "ACTIVE",
          },
        },
      ],
      where: {
        [Op.or]: {
          status: {
            [Op.in]: ["ACTIVE", "ARCHIVED"],
          },
          name: {
            [Op.like]: "DEV%",
          },
        },
        createdAt: {
          [Op.between]: [new Date(2020, 1, 1), new Date(2023, 12, 31)],
        },
      },
      order: [["name", "DESC"], ["createdAt"]],
      limit: 1,
      offset: 2 * 1 - 2, // limit * page - limit
    });

    console.log(JSON.stringify(customers, null, 2));
  }
}

Playground.play();
