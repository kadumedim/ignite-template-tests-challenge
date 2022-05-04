import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"

import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: InMemoryUsersRepository

describe('Create user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it("Should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@example.com",
      password: '123'
    })

    expect(user).toHaveProperty("id")

  })

  it("Should not be able to create a existent user", async () => {
    await createUserUseCase.execute({
      name: "User Test1",
      email: "user1@example.com",
      password: '123'
    })

    await expect(
      createUserUseCase.execute({
        name: "User Test1",
        email: "user1@example.com",
        password: '123'
      })

    ).rejects.toBeInstanceOf(CreateUserError)


  })

})
