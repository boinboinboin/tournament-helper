import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// Create a player
app.post("/players", async (req, res) => {
  const { firstName, lastName, club, seed } = req.body;
  const player = await prisma.player.create({
    data: { firstName, lastName, club, seed },
  });
  res.json(player);
});

// Get all players
app.get("/players", async (_req, res) => {
  const players = await prisma.player.findMany();
  res.json(players);
});

// Create a tournament
app.post("/tournaments", async (req, res) => {
  const { name, date, format } = req.body;
  const tournament = await prisma.tournament.create({
    data: { name, date: new Date(date), format },
  });
  res.json(tournament);
});

// Create a match
app.post("/matches", async (req, res) => {
  const { tournamentId, round, player1Id, player2Id } = req.body;
  const match = await prisma.match.create({
    data: {
      tournamentId,
      round,
      player1Id,
      player2Id,
    },
  });
  res.json(match);
});

// Update match scores
app.post("/matches/:id/score", async (req, res) => {
  const id = Number(req.params.id);
  const { player1Score, player2Score, winnerId } = req.body;
  const match = await prisma.match.update({
    where: { id },
    data: { player1Score, player2Score, winnerId },
  });
  res.json(match);
});

// Get all matches for a tournament
app.get("/tournaments/:id/matches", async (req, res) => {
  const id = Number(req.params.id);
  const matches = await prisma.match.findMany({
    where: { tournamentId: id },
    include: { player1: true, player2: true },
  });
  res.json(matches);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
