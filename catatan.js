const http = require("http");
let catatan = [];
let notesid = 1;

const server = http.createServer((req, res) => {
  // Menambah catatan baru (POST)
  if (req.method === "POST" && req.url === "/api/notes") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const note = JSON.parse(body);
      note.note_id = notesid++;
      note.created_at = new Date().toISOString(); // Tambahkan created_at saat catatan dibuat
      note.updated_at = note.created_at; // Di awal, updated_at sama dengan created_at
      catatan.push(note);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Catatan berhasil ditambahkan",
          note_id: note.note_id,
          created_at: note.created_at,
          updated_at: note.updated_at,
        })
      );
    });
    
  // Mendapatkan semua catatan (GET)
  } else if (req.method === "GET" && req.url === "/api/notes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(catatan));
  
  // Mendapatkan catatan berdasarkan ID (GET by ID)
  } else if (req.method === "GET" && req.url.match(/\/api\/notes\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const note = catatan.find((n) => n.note_id === id);

    if (note) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(note));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Catatan tidak ditemukan" }));
    }

  // Memperbarui catatan (PUT)
  } else if (req.method === "PUT" && req.url.match(/\/api\/notes\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const update = JSON.parse(body);
      const noteIndex = catatan.findIndex((n) => n.note_id === id);

      if (noteIndex !== -1) {
        catatan[noteIndex] = { 
          ...catatan[noteIndex], 
          ...update, 
          updated_at: new Date().toISOString() // Update updated_at saat catatan diperbarui
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Catatan berhasil diperbarui", updated_at: catatan[noteIndex].updated_at }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Catatan tidak ditemukan" }));
      }
    });

  // Menghapus catatan (DELETE)
  } else if (req.method === "DELETE" && req.url.match(/\/api\/notes\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const noteIndex = catatan.findIndex((n) => n.note_id === id);

    if (noteIndex !== -1) {
      catatan.splice(noteIndex, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Catatan berhasil dihapus" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Catatan tidak ditemukan" }));
    }

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Content tidak ditemukan" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
