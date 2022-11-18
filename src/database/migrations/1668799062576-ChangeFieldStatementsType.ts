import {MigrationInterface, QueryRunner} from "typeorm";

// Change field statements.type adding an extra item to the enum: 'transfer'
export class ChangeFieldStatementsType1668799062576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TYPE "public"."statements_type_enum" ADD VALUE 'transfer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TYPE "public"."statements_type_enum" RENAME TO "statements_type_enum_old"`);
      await queryRunner.query(`CREATE TYPE "statements_type_enum" AS ENUM('deposit', 'withdraw')`);
      await queryRunner.query(`ALTER TABLE "statements" ALTER COLUMN "type" TYPE "statements_type_enum" USING "type"::"text"::"statements_type_enum"`);
      await queryRunner.query(`DROP TYPE "statements_type_enum_old"`);
    }

}
