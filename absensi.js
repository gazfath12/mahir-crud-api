const http = require("http");
let absensi= [];
let absensiid = 1;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/attendance") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const absen = JSON.parse(body);
      absen.absensi_id = absensiid++;
      absensi.push(absen);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Absensi berhasil ditambahkan",
          absensi_id: absen.absensi_id,
        })
      );
    });
    
  } else if (req.method === "GET" && req.url === "/api/attendance") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(absensi));

  } else if (req.method === "GET" && req.url.match(/\/api\/attendence\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const absen = absensi.find((a) => a.absensi_id === id);

    if (absen) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(absen));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
    }

  } else if (req.method === "PUT" && req.url.match(/\/api\/attendance\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const update = JSON.parse(body);
      const absensiIndex = absensi.findIndex((a) => a.absensi_id === id);

      if (absensiIndex !== -1) {
        absensi[absensiIndex] = { ...absensi[absensiIndex], ...update };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Absensi berhasil diperbarui" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
      }
    });

  } else if (req.method === "DELETE" && req.url.match(/\/api\/attendance\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const absensiIndex = absensi.findIndex((a) => a.absensi_id === id);

    if (absensiIndex !== -1) {
      absensi.splice(absensiIndex, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi berhasil dihapus" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
    }

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Content tidak ditemukan" }));
  }
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
