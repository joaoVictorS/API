import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";

import User from "../models/User";

class UsersController {
  // Listar users
  async index(req, res) {
    const {
      name,
      email,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = {};
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

    const data = await User.findAll({
      attributes: { exclude: ["password", "password_hash"] },
      where,
      order,
      limit,
      offset: limit * page - limit,
    });

    console.log({ userId: req.userId });
    // console.log(User.findByPk(req.userID));

    return res.json(data);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "password_hash"] },
    });

    if (!user) {
      return res.status(404).json();
    }

    const { id, name, email, createdAt, updatedAt } = user;

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }
    const { id, name, email, file_id, createAt, updatedAt } = await User.create(
      req.body
    );

    return res.status(201).json({ id, name, email, file_id, createAt, updatedAt });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    const { oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "User password not match." });
    }

    const { id, name, email, file_id, createdAt, updatedAt } = await user.update(req.body);

    return res.status(201).json({ id, name, email, file_id, createdAt, updatedAt });
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.satus(404).json();
    }
    await user.destroy();

    return res.json();
  }
}

export default new UsersController();
