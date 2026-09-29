package com.codex.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

public class StaticFileHandler implements HttpHandler {
    private final File clientDir;

    public StaticFileHandler() {
        File current = new File(".").getAbsoluteFile();
        File dir = new File(current, "client");
        if (!dir.exists()) {
            dir = new File(current.getParentFile(), "client");
        }
        this.clientDir = dir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (path == null || path.equals("/") || path.isEmpty()) {
            path = "/index.html";
        }

        // Prevent directory traversal
        File targetFile = new File(clientDir, path.replace('/', File.separatorChar));
        if (!targetFile.exists() || targetFile.isDirectory()) {
            // SPA fallback: serve index.html
            targetFile = new File(clientDir, "index.html");
        }

        if (!targetFile.exists()) {
            String notFound = "404 Not Found";
            exchange.sendResponseHeaders(404, notFound.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(notFound.getBytes());
            }
            return;
        }

        String mimeType = Files.probeContentType(targetFile.toPath());
        if (mimeType == null) {
            if (targetFile.getName().endsWith(".css")) mimeType = "text/css; charset=UTF-8";
            else if (targetFile.getName().endsWith(".js")) mimeType = "application/javascript; charset=UTF-8";
            else if (targetFile.getName().endsWith(".html")) mimeType = "text/html; charset=UTF-8";
            else mimeType = "application/octet-stream";
        }

        exchange.getResponseHeaders().set("Content-Type", mimeType);
        exchange.getResponseHeaders().set("Cache-Control", "no-cache");
        exchange.sendResponseHeaders(200, targetFile.length());

        try (FileInputStream fis = new FileInputStream(targetFile);
             OutputStream os = exchange.getResponseBody()) {
            fis.transferTo(os);
        }
    }
}
