import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUser1735158168570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First create the enum
    await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."user_role_enum" AS ENUM ('admin', 'user');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

    // Then create the table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "name" character varying NOT NULL,
                "password" character varying NOT NULL,
                "isEmailVerified" boolean NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                "passportNumber" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table first
    await queryRunner.query(`DROP TABLE IF EXISTS "user" CASCADE`);

    // Then drop enum
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role_enum" CASCADE`);
  }
}
