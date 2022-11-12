import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("it should not be able to get a statement operation from a non-existent user", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "non-existent-user",
        statement_id: "non-existent-statement",
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("it should not be able to get a non-existent statement operation", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "non-existent-statement",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("it should be able to get a statement operation", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Description Test",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation.user_id).toEqual(statement.user_id);
    expect(statementOperation.type).toEqual(statement.type);
    expect(statementOperation.amount).toEqual(statement.amount);
    expect(statementOperation.description).toEqual(statement.description);
    expect(statementOperation.created_at).toEqual(statement.created_at);
  });
});
