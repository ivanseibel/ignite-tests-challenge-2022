import { create } from "domain";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should not be able to create a new statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "non-existent-user",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new withdraw statement with insufficient funds", async () => {
    expect( async () => {
      const user = await usersRepository.create({
        name: "User Test",
        email: "user@email.com",
        password: "1234",
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a new transfer statement with insufficient funds", async () => {
    const sender = await usersRepository.create({
      name: "Sender Test",
      email: "sender@email.com",
      password: "1234",
    });

    const receiver = await usersRepository.create({
      name: "Receiver Test",
      email: "receiver@email.com",
      password: "1234",
    });

    expect( async () => {
      await createStatementUseCase.execute({
        user_id: receiver.id as string,
        type: OperationType.TRANSFER,
        amount: 100,
        description: `Transfer from ${sender.name}`,
        sender_id: sender.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able to create a new deposit statement", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Description",
    });

    expect(statement).toHaveProperty("id");

  });

  it("should be able to create a new transfer statement", async () => {
    const sender = await usersRepository.create({
      name: "Sender Test",
      email: "sender@email.com",
      password: "1234",
    });

    const receiver = await usersRepository.create({
      name: "Receiver Test",
      email: "receiver@email.com",
      password: "1234",
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });

    const statement = await createStatementUseCase.execute({
      user_id: receiver.id as string,
      type: OperationType.TRANSFER,
      amount: 100,
      description: `Transfer from ${sender.name}`,
      sender_id: sender.id as string,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.sender_id).toBe(sender.id);
    expect(statement.type).toBe(OperationType.TRANSFER);
    expect(statement.amount).toBe(100);
    expect(statement.description).toBe(`Transfer from ${sender.name}`);
  });
});
