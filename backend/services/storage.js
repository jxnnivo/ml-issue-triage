// File storage helpers for tickets.json (ES module version)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to backend/data/tickets.json
const DATA_FILE = path.join(__dirname, "..", "data", "tickets.json");

// Read tickets array from JSON file
export function readTickets() {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
}

// Write tickets array back to JSON file
export function writeTickets(tickets) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2));
}

// Add one ticket to the JSON file and return it
export function addTicket(ticket) {
    const tickets = readTickets();
    tickets.push(ticket);
    writeTickets(tickets);
    return ticket;
}
