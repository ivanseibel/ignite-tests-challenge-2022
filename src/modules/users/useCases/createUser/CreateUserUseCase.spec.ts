import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should not be able to create a new user with an existing email", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "user@email.com",
        password: "1234",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });
});
