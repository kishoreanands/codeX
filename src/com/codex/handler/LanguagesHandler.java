package com.codex.handler;

import com.codex.model.CodeLanguage;
import com.codex.model.HumanLanguage;
import com.codex.service.LanguageService;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class LanguagesHandler implements HttpHandler {
    private final LanguageService languageService = LanguageService.getInstance();
    private final Gson gson = new Gson();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod().toUpperCase();
        String path = exchange.getRequestURI().getPath();

        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equals(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            if ("GET".equals(method) && "/api/languages".equals(path)) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);

                Map<String, Integer> count = new HashMap<>();
                count.put("human", languageService.getHumanLanguages().size());
                count.put("code", languageService.getCodeLanguages().size());
                resp.put("count", count);

                resp.put("humanLanguages", languageService.getHumanLanguages());
                resp.put("codeLanguages", languageService.getCodeLanguages());

                sendJsonResponse(exchange, 200, resp);
                return;
            }

            if ("POST".equals(method) && "/api/languages/human".equals(path)) {
                String body = readBody(exchange.getRequestBody());
                HumanLanguage newLang = gson.fromJson(body, HumanLanguage.class);
                HumanLanguage added = languageService.addHumanLanguage(newLang);

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Human language added successfully");
                resp.put("language", added);

                sendJsonResponse(exchange, 201, resp);
                return;
            }

            if ("POST".equals(method) && "/api/languages/code".equals(path)) {
                String body = readBody(exchange.getRequestBody());
                CodeLanguage newLang = gson.fromJson(body, CodeLanguage.class);
                CodeLanguage added = languageService.addCodeLanguage(newLang);

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Code language added successfully");
                resp.put("language", added);

                sendJsonResponse(exchange, 201, resp);
                return;
            }

            sendError(exchange, 404, "Endpoint not found");
        } catch (IllegalArgumentException iae) {
            sendError(exchange, 400, iae.getMessage());
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
