import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show a user profile", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to show a non-existent user profile", async () => {
    await expect(
      showUserProfileUseCase.execute("non-existent-user-id")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
