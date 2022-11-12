import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should not be able to authenticate a non-existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "user@email.com",
        password: "1234",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate if password doesn't match", async() => {
    await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "user@email.com",
        password: "incorrectPassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    const result = await authenticateUserUseCase.execute({
      email: "user@email.com",
      password: "1234",
    });

    expect(result).toHaveProperty("token");
  });
});
