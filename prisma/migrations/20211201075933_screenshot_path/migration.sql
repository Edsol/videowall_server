-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT
);
INSERT INTO "new_Bookmark" ("id", "url") SELECT "id", "url" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "mac" TEXT,
    "hostname" TEXT,
    "alias" TEXT NOT NULL DEFAULT '',
    "screenshotPath" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Client" ("hostname", "id", "ip", "mac") SELECT "hostname", "id", "ip", "mac" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_mac_key" ON "Client"("mac");
CREATE UNIQUE INDEX "Client_hostname_key" ON "Client"("hostname");
CREATE UNIQUE INDEX "Client_alias_key" ON "Client"("alias");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
