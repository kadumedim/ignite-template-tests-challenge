import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { OperationType } from "@modules/statements/entities/Statement";

import { CreateStatementError } from "./CreateStatementError"


let userRepositoryInMemory: InMemoryUsersRepository
let statementRepositoryInMemory: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe('Create Statement', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()

    statementRepositoryInMemory = new InMemoryStatementsRepository()

    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    )

    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory
    )
  })

  it('Should be able to create a statement with deposit', async () => {
    const user: ICreateUserDTO = {
      name: 'John',
      email: 'user@example.com',
      password: 'password'
    }

    const userCreated = await createUserUseCase.execute(user)

    const statement = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 10,
      description: 'description',
      type: 'deposit' as OperationType
    })

    expect(statement).toHaveProperty("id")

  })

  it('Should be able to create a statement with withdraw', async () => {
    const user: ICreateUserDTO = {
      name: 'John',
      email: 'user@example.com',
      password: 'password'
    }

    const userCreated = await createUserUseCase.execute(user)
    await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 10,
      description: 'description',
      type: 'deposit' as OperationType
    })

    const withdraw = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 5,
      description: 'description',
      type: 'withdraw' as OperationType
    })

    expect(withdraw).toHaveProperty('id')

  })

  it('Should not be possible to make a withdraw without balance', async () => {
    const user: ICreateUserDTO = {
      name: 'John',
      email: 'user@example.com',
      password: 'password'
    }

    const userCreated = await createUserUseCase.execute(user)

    await expect(
      createStatementUseCase.execute({
        user_id: userCreated.id,
        amount: 5,
        description: 'description',
        type: 'withdraw' as OperationType
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })

  it('Should not be able to create a statement if the user does not exists', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: 'abcd123',
        amount: 10,
        description: 'description',
        type: 'deposit' as OperationType
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  })

})
