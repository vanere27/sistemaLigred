/*
  Warnings:

  - You are about to drop the column `nombre` on the `Equipo` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Equipo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Profesor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "profesorId" INTEGER,
    "prestadoA" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Equipo_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipo" ("categoria", "codigo", "createdAt", "estado", "id", "ubicacion") SELECT "categoria", "codigo", "createdAt", "estado", "id", "ubicacion" FROM "Equipo";
DROP TABLE "Equipo";
ALTER TABLE "new_Equipo" RENAME TO "Equipo";
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_email_key" ON "Profesor"("email");
