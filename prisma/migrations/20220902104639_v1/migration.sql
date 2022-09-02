-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "lecture_id" SERIAL NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("lecture_id")
);
