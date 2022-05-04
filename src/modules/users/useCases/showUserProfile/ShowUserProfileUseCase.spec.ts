import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let userRepositoryInMemory: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase



describe("Show user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  })

  it("Should be able show user", async() => {
     const user = await userRepositoryInMemory.create({
      name: "User Test",
      email: "user@example.com",
      password: '123'
    })

    const { id: user_id } = user
    const profile = await showUserProfileUseCase.execute(user_id)

    expect(profile).toHaveProperty("id")

  })

  it("should be able to return error if user does not exits", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("abc134DcBA")
    }).rejects.toBeInstanceOf(AppError)

  })

})
