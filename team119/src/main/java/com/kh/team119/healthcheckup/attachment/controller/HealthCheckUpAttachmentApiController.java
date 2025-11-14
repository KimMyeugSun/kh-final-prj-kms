package com.kh.team119.healthcheckup.attachment.controller;

import com.kh.team119.common.FileController;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentLookUp;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentRegister;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentUpdate;
import com.kh.team119.healthcheckup.attachment.service.HealthCheckUpAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/health-checkup-attachments")
@RequiredArgsConstructor
public class HealthCheckUpAttachmentApiController {
    private final HealthCheckUpAttachmentService healthCheckUpAttachmentService;
    private final FileController fileCtrl;

    @Value("${ATTACHMENT.STORAGE_PATH.HEALTH_CHECKUP}")
    private String AttachmentStorageHealthCheckUpPath;

    @PostMapping("/register/{eno}")
    public ResponseEntity<RespHealthCheckUpAttachmentRegister> registerHealthCheckUpAttachment(@PathVariable Long eno, @RequestParam MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new Team119Exception(ErrorCode.FILE_EMPTY);
        }

        String fileName = fileCtrl.save(file, AttachmentStorageHealthCheckUpPath);

        var result = healthCheckUpAttachmentService.register(eno, fileName, file.getOriginalFilename());

        return ResponseEntity
                .ok(result);
    }

    @GetMapping("/{eno}")
    public ResponseEntity<RespHealthCheckUpAttachmentLookUp> attachmentLookUp(@PathVariable Long eno) {

        var result = healthCheckUpAttachmentService.lookUp(eno);

        return ResponseEntity
                .ok(result);
    }

    @PutMapping("/replace/{eno}/{hcno}")
    public ResponseEntity<RespHealthCheckUpAttachmentUpdate> updateAttachment(@PathVariable Long eno, @PathVariable Long hcno, @RequestParam MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new Team119Exception(ErrorCode.FILE_EMPTY);
        }

        String replaceFileName = fileCtrl.save(file, AttachmentStorageHealthCheckUpPath);

        var result = healthCheckUpAttachmentService.replaceAttachment(eno, hcno, AttachmentStorageHealthCheckUpPath, replaceFileName, file.getOriginalFilename());

        return ResponseEntity
                .ok(result);
    }

    @DeleteMapping("/{eno}/{hcno}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long eno, @PathVariable Long hcno) {

        healthCheckUpAttachmentService.deleteAttachment(eno, hcno, AttachmentStorageHealthCheckUpPath);

        return ResponseEntity
                .ok(Map.of("result", "SUCCESS"));
    }

    @GetMapping("download/{eno}/{hcno}")
    public ResponseEntity<Resource> download(@PathVariable Long eno, @PathVariable Long hcno) {

        Resource resource = healthCheckUpAttachmentService.download(eno, hcno, AttachmentStorageHealthCheckUpPath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/view/{eno}/{hcno}")
    public ResponseEntity<Resource> view(@PathVariable Long eno, @PathVariable Long hcno){
        Resource resource = healthCheckUpAttachmentService.download(eno, hcno, AttachmentStorageHealthCheckUpPath);

        String filename = resource.getFilename();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (filename != null) {
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (filename.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (filename.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            }
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(resource);
    }
}