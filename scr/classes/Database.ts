import mongoose from "mongoose";

class Database {
  user: any;

  constructor() {
    this.user = require("../schemas/User");
  }

  connect() {
    mongoose
      .connect(
        process.env.MONGO_URL as string,
        { useNewUrlParser: true } as any
      )
      .then(() => console.log("Database Conectada"))
      .catch((e) => console.log(`Erro Ao conectar a database: ${e}`));
  }

  async fecthUser(interaction: any) {
    const findUser = await this.user.findOne({ id: `${interaction.user.id}` });

    if (findUser) return findUser;

    const newUser = await this.user.create({ id: `${interaction.user.id}` });

    await newUser.save();

    return newUser;
  }
}

export = new Database();
