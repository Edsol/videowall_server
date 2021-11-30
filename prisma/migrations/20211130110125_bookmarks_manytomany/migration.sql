-- CreateTable
CREATE TABLE "Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BookmarksClients" (
    "clientId" INTEGER NOT NULL,
    "bookmarkId" INTEGER NOT NULL,

    PRIMARY KEY ("clientId", "bookmarkId"),
    CONSTRAINT "BookmarksClients_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookmarksClients_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
