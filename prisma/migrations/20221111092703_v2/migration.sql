/*
  Warnings:

  - You are about to drop the `Lecture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Lecture";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "USER" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "profile" TEXT NOT NULL,
    "name" VARCHAR(10) NOT NULL,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "CATEGORY" (
    "category" VARCHAR(10) NOT NULL,

    CONSTRAINT "CATEGORY_pkey" PRIMARY KEY ("category")
);

-- CreateTable
CREATE TABLE "USER_LIB" (
    "user_id" INTEGER NOT NULL,
    "best_category" VARCHAR(10),
    "book_total" INTEGER NOT NULL,
    "profile" TEXT NOT NULL,

    CONSTRAINT "USER_LIB_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "USER_STATUS" (
    "user_id" INTEGER NOT NULL,
    "return_date" TIMESTAMP(0) NOT NULL,
    "rental_total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "USER_STATUS_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "USER_SETTING" (
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "USER_SETTING_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "BOOK" (
    "book_id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "name" VARCHAR(10) NOT NULL,
    "publisher" VARCHAR(10) NOT NULL,
    "ISPN" VARCHAR(50) NOT NULL,
    "author" VARCHAR(20) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "BOOK_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "CATEGORY_BOOK" (
    "category_name" VARCHAR(10) NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "CATEGORY_BOOK_pkey" PRIMARY KEY ("category_name","book_id")
);

-- CreateTable
CREATE TABLE "ROOM" (
    "user_id" INTEGER NOT NULL,
    "attn_id" INTEGER NOT NULL,

    CONSTRAINT "ROOM_pkey" PRIMARY KEY ("user_id","attn_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_name_key" ON "USER"("name");

-- AddForeignKey
ALTER TABLE "USER_LIB" ADD CONSTRAINT "USER_LIB_best_category_fkey" FOREIGN KEY ("best_category") REFERENCES "CATEGORY"("category") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_LIB" ADD CONSTRAINT "USER_LIB_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_STATUS" ADD CONSTRAINT "USER_STATUS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_SETTING" ADD CONSTRAINT "USER_SETTING_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOOK" ADD CONSTRAINT "BOOK_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER_LIB"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CATEGORY_BOOK" ADD CONSTRAINT "CATEGORY_BOOK_category_name_fkey" FOREIGN KEY ("category_name") REFERENCES "CATEGORY"("category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CATEGORY_BOOK" ADD CONSTRAINT "CATEGORY_BOOK_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BOOK"("book_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROOM" ADD CONSTRAINT "ROOM_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER_LIB"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROOM" ADD CONSTRAINT "ROOM_attn_id_fkey" FOREIGN KEY ("attn_id") REFERENCES "USER_LIB"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
