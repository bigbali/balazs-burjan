/*
  Warnings:

  - Added the required column `cloudinaryAssetId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinaryPublicId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinaryAssetId` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinaryPublicId` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "path" TEXT NOT NULL,
    "cloudinaryAssetId" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER,
    CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("albumId", "createdAt", "description", "id", "path", "title", "updatedAt") SELECT "albumId", "createdAt", "description", "id", "path", "title", "updatedAt" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Thumbnail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "cloudinaryAssetId" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "albumId" INTEGER NOT NULL,
    CONSTRAINT "Thumbnail_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Thumbnail" ("albumId", "createdAt", "id", "path", "updatedAt") SELECT "albumId", "createdAt", "id", "path", "updatedAt" FROM "Thumbnail";
DROP TABLE "Thumbnail";
ALTER TABLE "new_Thumbnail" RENAME TO "Thumbnail";
CREATE UNIQUE INDEX "Thumbnail_albumId_key" ON "Thumbnail"("albumId");
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT 'Névtelen',
    "description" TEXT,
    "path" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "archive" TEXT,
    "date" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Album" ("archive", "createdAt", "date", "description", "hidden", "id", "path", "slug", "title", "updatedAt") SELECT "archive", "createdAt", "date", "description", "hidden", "id", "path", "slug", "title", "updatedAt" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
