import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";

import Customer from "../models/Customer";
import Contact from "../models/Contact";

class ContactsController {
  // Listagem dos Contacts
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = { customer_id: req.params.customer_id };
    let order = [];

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: name,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: email,
        },
      };
    }

    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(",").map(item => item.toUpperCase()),
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdBefore: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAfter: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedBefore: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAfter: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    }

    if (sort) {
      order = sort.split(",").map(item => item.split(":"));
    }

    const data = await Contact.findAll({
      where,
      include: {
        model: Customer,
        attributes: ["id", "status"],
        required: true,
      },
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  // Recupera um Customer
  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerID,
        id: req.params.id,
      },
      include: [Customer],
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json();
    }

    return res.json(contact);
  }

  // Cria um novo Customer
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }
    const contact = await Contact.create({
      customer_id: req.params.customerID,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  // Atualiza um contact
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerID,
        id: req.params.id,
      },
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.update(req.body);

    return res.json(contact);
  }

  // Exclui um Customer
  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerID,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.destroy();

    return res.json();
  }
}

export default new ContactsController();
