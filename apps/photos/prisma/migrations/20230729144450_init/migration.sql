-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER,
    CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Thumbnail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER NOT NULL,
    CONSTRAINT "Thumbnail_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Thumbnail_albumId_key" ON "Thumbnail"("albumId");
