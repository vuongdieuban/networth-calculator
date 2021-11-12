import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitDbEntities1636748828500 implements MigrationInterface {
  name = 'CreateInitDbEntities1636748828500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(32) NOT NULL, "hashed_password" character varying(256) NOT NULL, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "invalidated" boolean NOT NULL DEFAULT false, "expiry_date" character varying NOT NULL, CONSTRAINT "PK_a78813e06745b2c5d5b9776bfcf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "asset_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "chequing" numeric(14,2) NOT NULL DEFAULT '0', "savings_for_taxes" numeric(14,2) NOT NULL DEFAULT '0', "rainy_day_fund" numeric(14,2) NOT NULL DEFAULT '0', "savings_for_fun" numeric(14,2) NOT NULL DEFAULT '0', "savings_for_travel" numeric(14,2) NOT NULL DEFAULT '0', "savings_for_personal_development" numeric(14,2) NOT NULL DEFAULT '0', "investment_1" numeric(14,2) NOT NULL DEFAULT '0', "investment_2" numeric(14,2) NOT NULL DEFAULT '0', "investment_3" numeric(14,2) NOT NULL DEFAULT '0', "primary_home" numeric(14,2) NOT NULL DEFAULT '0', "secondary_home" numeric(14,2) NOT NULL DEFAULT '0', "other" numeric(14,2) NOT NULL DEFAULT '0', CONSTRAINT "UQ_509940740fede7555d89c104f54" UNIQUE ("user_id"), CONSTRAINT "REL_509940740fede7555d89c104f5" UNIQUE ("user_id"), CONSTRAINT "PK_038b7b28b83db2205747ef9912e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "liability_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "credit_card_1" numeric(14,2) NOT NULL DEFAULT '0', "credit_card_1_monthly_payment" numeric(14,2) NOT NULL DEFAULT '200', "credit_card_2" numeric(14,2) NOT NULL DEFAULT '0', "credit_card_2_monthly_payment" numeric(14,2) NOT NULL DEFAULT '150', "mortgage_1" numeric(14,2) NOT NULL DEFAULT '0', "mortgage_1_monthly_payment" numeric(14,2) NOT NULL DEFAULT '2000', "mortgage_2" numeric(14,2) NOT NULL DEFAULT '0', "mortgage_2_monthly_payment" numeric(14,2) NOT NULL DEFAULT '3500', "line_of_credit" numeric(14,2) NOT NULL DEFAULT '0', "line_of_credit_monthly_payment" numeric(14,2) NOT NULL DEFAULT '500', "investment_loan" numeric(14,2) NOT NULL DEFAULT '0', "investment_loan_monthly_payment" numeric(14,2) NOT NULL DEFAULT '700', CONSTRAINT "UQ_6e00720b323e050c8b914ce6093" UNIQUE ("user_id"), CONSTRAINT "REL_6e00720b323e050c8b914ce609" UNIQUE ("user_id"), CONSTRAINT "PK_e7a220154abac87030663c5e557" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_selected_currency_entity_currency_enum" AS ENUM('CAD', 'USD', 'EUR', 'KYD', 'CNY', 'CHF', 'SGD', 'XRP', 'OMR', 'BYR', 'AZN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_selected_currency_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "currency" "public"."user_selected_currency_entity_currency_enum" NOT NULL DEFAULT 'CAD', "user_id" uuid NOT NULL, CONSTRAINT "UQ_c9805056d6412bd1df647250d7f" UNIQUE ("user_id"), CONSTRAINT "REL_c9805056d6412bd1df647250d7" UNIQUE ("user_id"), CONSTRAINT "PK_b1076baefaea3e35e8a3bce6f9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token_entity" ADD CONSTRAINT "FK_06d69eb4c771cb92bab441f67a2" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset_entity" ADD CONSTRAINT "FK_509940740fede7555d89c104f54" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "liability_entity" ADD CONSTRAINT "FK_6e00720b323e050c8b914ce6093" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_selected_currency_entity" ADD CONSTRAINT "FK_c9805056d6412bd1df647250d7f" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_selected_currency_entity" DROP CONSTRAINT "FK_c9805056d6412bd1df647250d7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "liability_entity" DROP CONSTRAINT "FK_6e00720b323e050c8b914ce6093"`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset_entity" DROP CONSTRAINT "FK_509940740fede7555d89c104f54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token_entity" DROP CONSTRAINT "FK_06d69eb4c771cb92bab441f67a2"`,
    );
    await queryRunner.query(`DROP TABLE "user_selected_currency_entity"`);
    await queryRunner.query(`DROP TYPE "public"."user_selected_currency_entity_currency_enum"`);
    await queryRunner.query(`DROP TABLE "liability_entity"`);
    await queryRunner.query(`DROP TABLE "asset_entity"`);
    await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
