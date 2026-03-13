/*
  Warnings:

  - You are about to drop the `Profesor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `profesorId` on the `Equipo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profesor_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Profesor";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Disponible',
    "encargadoId" INTEGER,
    "prestadoA" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Equipo_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipo" ("categoria", "codigo", "createdAt", "descripcion", "estado", "id", "prestadoA", "ubicacion") SELECT "categoria", "codigo", "createdAt", "descripcion", "estado", "id", "prestadoA", "ubicacion" FROM "Equipo";
DROP TABLE "Equipo";
ALTER TABLE "new_Equipo" RENAME TO "Equipo";
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
