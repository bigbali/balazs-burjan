-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Thumbnail_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Thumbnail" ("albumId", "cloudinaryAssetId", "cloudinaryPublicId", "createdAt", "format", "height", "id", "path", "size", "updatedAt", "width") SELECT "albumId", "cloudinaryAssetId", "cloudinaryPublicId", "createdAt", "format", "height", "id", "path", "size", "updatedAt", "width" FROM "Thumbnail";
DROP TABLE "Thumbnail";
ALTER TABLE "new_Thumbnail" RENAME TO "Thumbnail";
CREATE UNIQUE INDEX "Thumbnail_albumId_key" ON "Thumbnail"("albumId");
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
    CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("albumId", "cloudinaryAssetId", "cloudinaryPublicId", "createdAt", "description", "format", "height", "id", "path", "size", "title", "updatedAt", "width") SELECT "albumId", "cloudinaryAssetId", "cloudinaryPublicId", "createdAt", "description", "format", "height", "id", "path", "size", "title", "updatedAt", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
