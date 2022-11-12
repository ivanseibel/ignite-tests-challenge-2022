import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get balance", async () => {
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

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance.statement).toEqual([statement]);
    expect(balance).toHaveProperty("balance");
    expect(balance.balance).toEqual(100);
  });

  it("should not be able to get balance from a non-existent user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "non-existent-user",
      })
    ).rejects.toEqual(new GetBalanceError());
  });
});
