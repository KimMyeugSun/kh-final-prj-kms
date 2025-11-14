package com.kh.team119.common;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.kh.team119.banner.dto.RespBanner;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.*;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FileController {
    private final AmazonS3 s3;

    @Value("${CDN_ORIGIN.URL}")
    private String cdnOriginUrl;

    @Value("${TEMPLATE.STORAGE_PATH.IMG}")
    private String templateStoragePath;

    @Value("${NOTICE_BOARD.STORAGE_PATH.IMG}")
    private String noticeBoardStoragePath;

    @Value("${MEAL_STORAGE_PATH.IMG}")
    private String mealStoragePath;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public void remove(String targetPath, String targetFileName) {
        String fullPath = targetPath + targetFileName;
        s3.deleteObject(bucket, fullPath);
    }

    public String save(MultipartFile targetFile, String targetPath) {
        if (targetFile == null) {
            return "default.png";
        }

        String fileName = targetFile.getOriginalFilename();
        int idx = fileName.lastIndexOf(".");
        String ext = fileName.substring(idx);
        String savedFilename = System.currentTimeMillis() + UUID.randomUUID().toString() + ext;
        String fullPath = targetPath + savedFilename;

        //S3에 파일 업로드
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(targetFile.getContentType());
        metadata.setContentLength(targetFile.getSize());
        try {
            PutObjectResult putObjectResult = s3.putObject(bucket, fullPath, targetFile.getInputStream(), metadata);
        } catch (IOException e) {
            throw new Team119Exception(ErrorCode.FILE_UPLOAD_FAIL);
        }

        return savedFilename;
    }

    public RespBanner bannerUrl(String path, String fileName, String link) {
        return RespBanner.builder()
                .bannerImageUrl(String.format("%s/%s%s", cdnOriginUrl, path, fileName))
                .bannerLink(link)
                .build();
    }

    public String templateSave(MultipartFile targetFile, Long eno) {
        if (targetFile == null) return "err.png";
        //!< 글 등록 할 때 이미지 첨부하면 저장되는 메서드
        //!< 경로는 template/{eno}/img/
        String dirPath = String.format(templateStoragePath, eno);
        String fileName = targetFile.getOriginalFilename();

        int idx = fileName.lastIndexOf(".");
        String ext = fileName.substring(idx);
        String savedFilename = System.currentTimeMillis() + UUID.randomUUID().toString() + ext;
        String fullPath = dirPath + savedFilename;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(targetFile.getContentType());
        metadata.setContentLength(targetFile.getSize());
        try {
            PutObjectResult putObjectResult = s3.putObject(bucket, fullPath, targetFile.getInputStream(), metadata);
        } catch (IOException e) {
            throw new Team119Exception(ErrorCode.FILE_UPLOAD_FAIL);
        }
        return savedFilename;
    }

    public void templateDelete(Long eno) {

        String fullPath = String.format(templateStoragePath, eno);

        ListObjectsV2Request req = new ListObjectsV2Request().withBucketName(bucket).withPrefix(fullPath);
        ListObjectsV2Result result;
        do {
            result = s3.listObjectsV2(req);
            for (S3ObjectSummary objectSummary : result.getObjectSummaries()) {
                s3.deleteObject(bucket, objectSummary.getKey());
            }
            req.setContinuationToken(result.getNextContinuationToken());
        } while (result.isTruncated());
    }

    public Resource download(String fileName, String filePath) {
        try {
            String fullPath = filePath + fileName;
            URL url = s3.getUrl(bucket, fullPath);
            Resource resource = new UrlResource(url);

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new Team119Exception(ErrorCode.NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT);
            }
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT);
        }
    }

    public boolean moveTo(Long eno, String originPath, Long nbno, List<String> fileNames) {
        String sourceKeyPrefix = String.format(templateStoragePath, eno);
        String destinationKeyPrefix = String.format(originPath, nbno);

        for (String fileName : fileNames) {
            String sourceKey = sourceKeyPrefix + fileName;
            String destKey = destinationKeyPrefix + fileName;

            log.debug("Moving S3 object from '{}' to '{}'", sourceKey, destKey);

            if (!s3ObjectExists(sourceKey)) {
                log.warn("Source key not found in S3: {}", sourceKey);
                return false;
            }

            CopyObjectRequest copyObjRequest = new CopyObjectRequest(bucket, sourceKey, bucket, destKey);
            s3.copyObject(copyObjRequest);
            s3.deleteObject(bucket, sourceKey);
        }

        templateDelete(eno);

        return true;
    }

    private boolean s3ObjectExists(String key) {
        try {
            boolean exists = s3.doesObjectExist(bucket, key);
            log.debug("S3 exists check for key='{}' => {}", key, exists);
            return exists;
        } catch (Exception e) {
            log.warn("S3 exists check failed for key='{}'", key, e);
            return false;
        }
    }
}