package com.codex.handler;

import com.codex.model.GenerateRequest;
import com.codex.model.GenerateResponse;
import com.codex.service.GeneratorService;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class GenerateHandler implements HttpHandler {
    private final GeneratorService generatorService = GeneratorService.getInstance();
    private final Gson gson = new Gson();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod().toUpperCase();

        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equals(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equals(method)) {
            sendError(exchange, 405, "Method not allowed. Use POST.");
            return;
        }

        try {
            String body = readBody(exchange.getRequestBody());
            GenerateRequest req = gson.fromJson(body, GenerateRequest.class);

            if (req == null || req.getPrompt() == null || req.getPrompt().trim().isEmpty()) {
                sendError(exchange, 400, "Prompt is required");
                return;
            }

            GenerateResponse response = generatorService.generate(req);
            sendJsonResponse(exchange, 200, response);
        } catch (Exception ex) {
            ex.printStackTrace();
            sendError(exchange, 500, ex.getMessage());
        }
    }

    private void sendJsonResponse(HttpExchange exchange, int status, Object data) throws IOException {
        byte[] bytes = gson.toJson(data).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void sendError(HttpExchange exchange, int status, String message) throws IOException {
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("error", message);
        sendJsonResponse(exchange, status, err);
    }

    private String readBody(InputStream is) throws IOException {
        return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }
}
