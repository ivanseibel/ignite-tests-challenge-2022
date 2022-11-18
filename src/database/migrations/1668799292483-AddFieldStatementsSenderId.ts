import {MigrationInterface, QueryRunner} from "typeorm";

// Add field statements.sender_id to identify the user that sent the transfer.
// This field is nullable because it is not necessary to fill it in the case of a deposit or a withdrawal.
// Create a foreign key to the users table.
export class AddFieldStatementsSenderId1668799292483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "statements" ADD "sender_id" uuid`);
      await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_8f0e9d9b0e1f9b9b1b0c9b0e1f9" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_8f0e9d9b0e1f9b9b1b0c9b0e1f9"`);
      await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "sender_id"`);
    }

}
