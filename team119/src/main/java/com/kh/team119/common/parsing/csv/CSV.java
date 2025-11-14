//package com.kh.team119.common.parsing.csv;
//
//import lombok.Getter;
//import org.apache.commons.csv.CSVFormat;
//import org.apache.commons.csv.CSVParser;
//import org.apache.commons.csv.CSVRecord;
//import org.springframework.core.io.ClassPathResource;
//
//import java.io.IOException;
//import java.io.InputStreamReader;
//import java.nio.charset.StandardCharsets;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Getter
//public class CSV {
//    public Hospital hospital = new Hospital();
//    public Pharmacy pharmacy = new Pharmacy();
//    public Health health = new Health();
//
//    public CSV() {
//        try {
//            hospital.readHospitalInfoCsv();
//            pharmacy.readPharmacyInfoCsv();
//            health.readHospitalInfoCsv();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    public class Pharmacy {
//        private List<Map<String, String>> pharmacyMap = new ArrayList<>();
//        String[] colName = {
//                "HP_ID", "DUTY_ADDR", "DUTY_NAME", "DUTY_TEL1",
//                "DUTY_TIME1C", "DUTY_TIME2C", "DUTY_TIME3C", "DUTY_TIME4C", "DUTY_TIME5C", "DUTY_TIME6C", "DUTY_TIME7C", "DUTY_TIME8C",
//                "DUTY_TIME1S", "DUTY_TIME2S", "DUTY_TIME3S", "DUTY_TIME4S", "DUTY_TIME5S", "DUTY_TIME6S", "DUTY_TIME7S", "DUTY_TIME8S",
//                "POSTCDN1", "POSTCDN2",
//                "WGS84LON", "WGS84LAT"
//        };
//
//        public void readPharmacyInfoCsv() throws IOException {
//            ClassPathResource resource = new ClassPathResource("static/etc/PHARMACYINFO.csv");
//            InputStreamReader reader = null;
//            try {
//                reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
//            } catch (IOException e) {
//                throw new RuntimeException(e);
//            }
//
//            CSVFormat csvFormat = CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim();
//            try (CSVParser csvParser = new CSVParser(reader, csvFormat)) {
//                var headers = csvParser.getHeaderNames();
//
//                for (CSVRecord csvRecord : csvParser) {
//                    int rowNumber = (int) csvRecord.getRecordNumber() - 1; // 현재 레코드의 행 번호
//                    pharmacyMap.add(new HashMap<String, String>());
//                    int last = pharmacyMap.size() - 1;
//
//                    for (int i = 0; i < colName.length; ++i) {
//                        pharmacyMap.get(last).put(colName[i], csvRecord.get(i));
//                    }
//                }
//            }
//            lengthCheck();
//            SaveDML();
//        }
//
//        void SaveDML() {
//            StringBuffer sb = new StringBuffer();
//
//            for (int i = 0; i < pharmacyMap.size(); i++) {
//                sb.append("INSERT INTO PHARMACY (");
//                for (String s : colName) {
//                    sb.append(s).append(", ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(") VALUES");
//                sb.append("(");
//                for (String s : colName) {
//                    sb.append("'").append(pharmacyMap.get(i).get(s).replace("'", "''")).append("', ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(");\n");
//            }
//
//            String filePath = "src/main/resources/static/pharmacy_info.sql";
//            try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.FileWriter(filePath))) {
//                writer.write(sb.toString());
//            } catch (java.io.IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        void lengthCheck() {
//            System.out.println("pharmacyMap size: " + pharmacyMap.size());
//            for (int i = 0; i < pharmacyMap.size(); i++) {
//                for (String s : colName) {
//                    if (pharmacyMap.get(i).get(s).length() > 255) {
//                        System.out.println(s + " : " + pharmacyMap.get(i).get(s).length());
//                    }
//                }
//            }
//        }
//    }
//
//    public class Hospital {
//        private List<Map<String, String>> hospitalMap = new ArrayList<>();
//        String[] colName = {
//                "HP_ID", "DUTY_ADDR", "DUTY_DIV", "DUTY_DIV_NAM", "DUTY_EM_CLS",
//                "DUTY_EM_CLS_NAME", "DUTY_ER_YN", "DUTY_ETC", "DUTY_INF", "DUTY_MAP_IMG",
//                "DUTY_NAME", "DUTY_TEL1", "DUTY_TEL3",
//                "DUTY_TIME1C", "DUTY_TIME2C", "DUTY_TIME3C", "DUTY_TIME4C", "DUTY_TIME5C", "DUTY_TIME6C", "DUTY_TIME7C", "DUTY_TIME8C",
//                "DUTY_TIME1S", "DUTY_TIME2S", "DUTY_TIME3S", "DUTY_TIME4S", "DUTY_TIME5S", "DUTY_TIME6S", "DUTY_TIME7S", "DUTY_TIME8S",
//                "POSTCDN1", "POSTCDN2",
//                "WGS84LON", "WGS84LAT"
//        };
//
//        public void readHospitalInfoCsv() throws IOException {
//            ClassPathResource resource = new ClassPathResource("static/etc/HOSPITALINFO.csv");
//            InputStreamReader reader = null;
//            try {
//                reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
//            } catch (IOException e) {
//                throw new RuntimeException(e);
//            }
//
//            CSVFormat csvFormat = CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim();
//
//
//            try (CSVParser csvParser = new CSVParser(reader, csvFormat)) {
//                var headers = csvParser.getHeaderNames();
//
//                for (CSVRecord csvRecord : csvParser) {
//                    int rowNumber = (int) csvRecord.getRecordNumber() - 1; // 현재 레코드의 행 번호
//                    hospitalMap.add(new HashMap<String, String>());
//                    int last = hospitalMap.size() - 1;
//
//                    for (int i = 0; i < colName.length; ++i) {
//                        hospitalMap.get(last).put(colName[i], csvRecord.get(i));
//                    }
//                }
//            }
//
//            lengthCheck();
//            SaveDML();
//        }
//
//        void SaveDML() {
//            StringBuffer sb = new StringBuffer();
//
//            for (int i = 0; i < hospitalMap.size(); i++) {
//                sb.append("INSERT INTO HOSPITAL (");
//                for (String s : colName) {
//                    sb.append(s).append(", ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(") VALUES");
//                sb.append("(");
//                for (String s : colName) {
//                    sb.append("'").append(hospitalMap.get(i).get(s).replace("'", "''")).append("', ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(");\n");
//            }
//
//            String filePath = "src/main/resources/static/db/hospital_info.sql";
//            try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.FileWriter(filePath))) {
//                writer.write(sb.toString());
//            } catch (java.io.IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        void lengthCheck() {
//            System.out.println("hospitalMap size: " + hospitalMap.size());
//            for (int i = 0; i < hospitalMap.size(); i++) {
//                for (String s : colName) {
//                    if (hospitalMap.get(i).get(s).length() > 255) {
//                        System.out.println(s + " : " + hospitalMap.get(i).get(s).length());
//                    }
//                }
//            }
//        }
//    }
//
//    public class Health {
//        private List<Map<String, String>> healthMap = new ArrayList<>();
//        String[] FilePaths = {
//                "static/etc/health_data_part_1.csv", "static/etc/health_data_part_2.csv", "static/etc/health_data_part_3.csv", "static/etc/health_data_part_4.csv", "static/health_data_part_5.csv"
//        };
//        String[] colName = {
//                "NAME","AGE","BMI","BLOOD_PRESSURE","BLOOD_SUGAR","HEALTH_CONDITION",
//                "HEART_RATE","CHOLESTEROL_LEVEL","SMOKING_STATUS","ALCOHOL_CONSUMPTION",
//                "PHYSICAL_ACTIVITY","SLEEP_HOURS","STRESS_LEVEL","DIET_TYPE","MEDICAL_HISTORY","GENETIC_RISK"
//        };
//
//        public void readHospitalInfoCsv() throws IOException {
//
//            for (String filePath : FilePaths) {
//                ClassPathResource resource = new ClassPathResource(filePath);
//                InputStreamReader reader = null;
//                try {
//                    reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
//                } catch (IOException e) {
//                    throw new RuntimeException(e);
//                }
//
//                CSVFormat csvFormat = CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim();
//
//                try (CSVParser csvParser = new CSVParser(reader, csvFormat)) {
//                    for (CSVRecord csvRecord : csvParser) {
//                        healthMap.add(new HashMap<String, String>());
//
//                        int last = healthMap.size() - 1;
//                        for (int i = 0; i < colName.length; ++i) {
//                            healthMap.get(last).put(colName[i], csvRecord.get(i));
//                        }
//                    }
//                }
//            }
//
//            lengthCheck();
//            saveHealthDML();
//        }
//
//        void saveHealthDML() {
//            String[] colName = {
//                    "BMI","BLOOD_PRESSURE","BLOOD_SUGAR","HEALTH_CONDITION",
//                    "HEART_RATE","CHOLESTEROL_LEVEL","SMOKING_STATUS","ALCOHOL_CONSUMPTION",
//                    "PHYSICAL_ACTIVITY","SLEEP_HOURS","STRESS_LEVEL","DIET_TYPE"
//            };
//
//            Map<String, Map<String, Integer>> temp = new HashMap<>();
//            temp.put("SMOKING_STATUS", new HashMap<>());
//            temp.get("SMOKING_STATUS").put("Non-smoker", 0);
//            temp.get("SMOKING_STATUS").put("Smoker", 1);
//
//            temp.put("ALCOHOL_CONSUMPTION", new HashMap<>());
//            temp.get("ALCOHOL_CONSUMPTION").put("None", 0);
//            temp.get("ALCOHOL_CONSUMPTION").put("Low", 1);
//            temp.get("ALCOHOL_CONSUMPTION").put("Moderate", 2);
//            temp.get("ALCOHOL_CONSUMPTION").put("High", 3);
//
//            temp.put("DIET_TYPE", new HashMap<>());
//            temp.get("DIET_TYPE").put("Balanced", 0);
//            temp.get("DIET_TYPE").put("High Carb", 1);
//            temp.get("DIET_TYPE").put("High Protein", 2);
//            temp.get("DIET_TYPE").put("Vegan", 3);
//
//            temp.put("PHYSICAL_ACTIVITY", new HashMap<>());
//            temp.get("PHYSICAL_ACTIVITY").put("Low", -1);
//            temp.get("PHYSICAL_ACTIVITY").put("Moderate", 0);
//            temp.get("PHYSICAL_ACTIVITY").put("High", 1);
//
//            temp.put("HEALTH_CONDITION", new HashMap<>());
//            temp.get("HEALTH_CONDITION").put("Healthy", 0);
//            temp.get("HEALTH_CONDITION").put("Diabetes", 1);
//            temp.get("HEALTH_CONDITION").put("Hypertension", 2);
//            temp.get("HEALTH_CONDITION").put("Obesity", 4);
//            temp.get("HEALTH_CONDITION").put("Cardiac Issues", 8);
//
//            StringBuffer sb = new StringBuffer();
//
//            for (int i = 0; i < healthMap.size(); i++) {
//                sb.append("INSERT INTO HEALTH (");
//                for (String s : colName) {
//                    sb.append(s).append(", ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(") VALUES");
//                sb.append("(");
//                for (String s : colName) {
//                    if(temp.containsKey(s))
//                        sb.append(temp.get(s).get(healthMap.get(i).get(s))).append(", ");
//                    else
//                        sb.append("'").append(healthMap.get(i).get(s).replace("'", "''")).append("', ");
//                }
//                sb.setLength(sb.length() - 2); // 마지막 ", " 제거
//                sb.append(");\n");
//            }
//
//            String filePath = "src/main/resources/static/HEALTH.sql";
//            try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.FileWriter(filePath))) {
//                writer.write(sb.toString());
//            } catch (java.io.IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        void lengthCheck() {
//            System.out.println("healthMap size: " + healthMap.size());
//            for (int i = 0; i < healthMap.size(); i++) {
//                for (String s : colName) {
//                    if (healthMap.get(i).get(s).length() > 255) {
//                        System.out.println(s + " : " + healthMap.get(i).get(s).length());
//                    }
//                }
//            }
//        }
//    }
//}