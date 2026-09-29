package com.codex;

import com.codex.handler.GenerateHandler;
import com.codex.handler.LanguagesHandler;
import com.codex.handler.StaticFileHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

public class Main {
    private static final int DEFAULT_PORT = 3000;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
            server.setExecutor(Executors.newCachedThreadPool());

            LanguagesHandler languagesHandler = new LanguagesHandler();
            GenerateHandler generateHandler = new GenerateHandler();
            StaticFileHandler staticHandler = new StaticFileHandler();

            server.createContext("/api/languages", languagesHandler);
            server.createContext("/api/generate", generateHandler);

            server.createContext("/api/health", exchange -> {
                String resp = "{\"status\":\"ok\",\"runtime\":\"Java 17 LTS\"}";
                byte[] bytes = resp.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            });

            server.createContext("/", staticHandler);

            server.start();
            System.out.printf("[CodeX Java Server] Online & listening at http://localhost:%d%n", port);
        } catch (Exception e) {
            System.err.println("[CodeX Java Server] Failed to start server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
