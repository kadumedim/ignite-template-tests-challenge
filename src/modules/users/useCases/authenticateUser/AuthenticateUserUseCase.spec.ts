import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase


describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  })

  it('Should not be able to authenticate an no exist user.', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'userdoesnotexists@email.com',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it('Should not be able to authenticate user with invalid password', async () => {
    const user = {
      name: "User Error Password",
      email: "password@example.com",
      password: '123'
    }

    await createUserUseCase.execute(user)

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: '1234'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it('Should be able authenticate an user', async () => {
    const user = {
      name: 'John',
      email: 'john@example.com',
      password: '233'
    }

    await createUserUseCase.execute(user)

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(userAuthenticated).toHaveProperty("token");

  })

})
