package com.example.oct28.finalproject.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/exports/bookings")
public class ExportController {

    @Value("${exports.bookings.dir:exports/bookings}")
    private String exportDir;

    // GET /api/exports/bookings -> list csv filenames
    @GetMapping
    public ResponseEntity<List<String>> listExports() {
        File folder = new File(exportDir);
        if (!folder.exists()) folder.mkdirs();

        String[] files = folder.list((dir, name) -> name.toLowerCase().endsWith(".csv"));
        List<String> fileList = files != null
                ? Arrays.asList(files)
                : List.of();

        return ResponseEntity.ok(fileList);
    }

    // GET /api/exports/bookings/{filename} -> download file
    @GetMapping("/{filename:.+}")
    public ResponseEntity<InputStreamResource> downloadExport(@PathVariable String filename) throws IOException {
        File file = new File(exportDir + "/" + filename);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(Files.newInputStream(file.toPath()));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(file.length())
                .body(resource);
    }

    /**
     * POST /api/exports/bookings
     * Accept a single multipart file under key "file" and save it to exportDir.
     * Optional form field "filename" can hint the stored filename.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadExport(@RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "filename", required = false) String filenameHint) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file provided");
        }

        // ensure folder exists
        File folder = new File(exportDir);
        if (!folder.exists() && !folder.mkdirs()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create export directory");
        }

        // decide a safe filename
        String original = file.getOriginalFilename() == null ? "upload.csv" : file.getOriginalFilename();
        String safeName = (filenameHint != null && !filenameHint.isBlank()) ? filenameHint : original;

        // sanitize: keep only the final name
        safeName = Paths.get(safeName).getFileName().toString();

        // ensure .csv extension if not present (optional)
        if (!safeName.toLowerCase().endsWith(".csv")) {
            safeName = safeName + ".csv";
        }

        // avoid overwrite by appending (n) if necessary
        Path dest = Paths.get(folder.getAbsolutePath(), safeName);
        int count = 1;
        String base = safeName;
        while (Files.exists(dest)) {
            int dot = base.lastIndexOf('.');
            String newName;
            if (dot > 0) {
                String prefix = base.substring(0, dot);
                String ext = base.substring(dot);
                newName = String.format("%s(%d)%s", prefix, count, ext);
            } else {
                newName = String.format("%s(%d)", base, count);
            }
            dest = Paths.get(folder.getAbsolutePath(), newName);
            count++;
        }

        try {
            // write file to disk
            Files.copy(file.getInputStream(), dest);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file", e);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(dest.getFileName().toString());
    }
}
