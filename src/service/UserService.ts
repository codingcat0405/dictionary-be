import { getRepositories } from "../data-source"
import * as jwt from "jsonwebtoken"

class UserService {
  private readonly repositories = getRepositories()

  async register(data: { fullName: string, username: string, password: string }) {
    const existUser = await this.repositories.user.findOne({
      where: {
        username: data.username
      }
    })
    if (existUser) {
      throw new Error("User already exists")
    }
    const hashPassword = await Bun.password.hash(data.password, 'bcrypt')
    const newUser = this.repositories.user.create({
      fullName: data.fullName,
      username: data.username,
      password: hashPassword,
      role: data.username === "admin" ? "admin" : "user"
    })
    await this.repositories.user.save(newUser)
    return newUser
  }

  async login(data: { username: string, password: string }) {
    const user = await this.repositories.user.findOne({
      where: {
        username: data.username
      }
    })
    if (!user) {
      throw new Error("User not found")
    }
    const isPasswordValid = await Bun.password.verify(data.password, user.password, 'bcrypt')
    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }
    const token = jwt.sign({ id: user.id, role: user.role }, "1ff96071c4c27b13760daa06ce149b70e188ba016e21cdd68863772eb8d4a2b2")
    return {
      user,
      token
    }
  }
}

export default UserService;