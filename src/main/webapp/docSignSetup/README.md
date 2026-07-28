คำสั่งรันบนเครื่อง Windows (D:\mobile\)

React (Vite) — ทำได้เลย:

bash
cd D:\mobile\pr-signature-app
npm install
npm run dev
# เปิด http://localhost:5173

Java Maven — ต้องติดตั้ง Maven ก่อน:

bash
# ดาวน์โหลด: https://maven.apache.org/download.cgi
cd D:\mobile\pr-signature-backend
mvn clean package
# copy target/pr-signature.war → Tomcat/webapps/

PHP — ต้องติดตั้ง PHP + Composer ก่อน:

bash
# PHP: https://windows.php.net/download
# Composer: https://getcomposer.org
cd D:\mobile\pr-signature-php
composer install
composer start
# เปิด http://localhost:8081


# PR Signature Template Setup

ระบบกำหนด Template ลายเซ็น สำหรับเอกสารจัดซื้อ (PR/PO/GR/IV)

## โครงสร้างไฟล์

```
D:\mobile\
├── index.html                    ← หน้าเว็บหลัก
├── style.css                     ← CSS styles
├── app.js                        ← JavaScript logic
├── SignatureTemplateServlet.java  ← Java Servlet (backend)
└── README.md                     ← ไฟล์นี้
```

## วิธีติดตั้ง Frontend

เพียงวางไฟล์ `index.html`, `style.css`, `app.js` ใน Web Root ของ Tomcat:

```
TOMCAT_HOME/webapps/ROOT/
├── index.html
├── style.css
└── app.js
```

หรือเปิดไฟล์ `index.html` โดยตรงบน Browser ได้เลย (ทุกฟีเจอร์ทำงาน ยกเว้นการ Save ไปยัง Backend)

## วิธีติดตั้ง Java Servlet (Backend)

### 1. Compile
```bash
javac -cp tomcat/lib/servlet-api.jar SignatureTemplateServlet.java
```

### 2. วางไฟล์
```
TOMCAT_HOME/webapps/ROOT/
└── WEB-INF/
    └── classes/
        └── com/company/procurement/
            └── SignatureTemplateServlet.class
```

### 3. web.xml (ถ้าไม่ใช้ @WebServlet annotation)
```xml
<servlet>
  <servlet-name>SignatureTemplateServlet</servlet-name>
  <servlet-class>com.company.procurement.SignatureTemplateServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>SignatureTemplateServlet</servlet-name>
  <url-pattern>/SignatureTemplateServlet</url-pattern>
</servlet-mapping>
```

### 4. เชื่อมต่อ Database
เปิดไฟล์ `SignatureTemplateServlet.java` แล้วแก้ส่วน `TODO` ให้ชี้ไปที่ DB จริง

## API Endpoints

| Method | URL | คำอธิบาย |
|--------|-----|----------|
| POST | /SignatureTemplateServlet | บันทึก Template (JSON body) |
| GET | /SignatureTemplateServlet?action=list | ดูรายการ Template ทั้งหมด |
| GET | /SignatureTemplateServlet?action=load&id=xxx | โหลด Template ตาม ID |
| GET | /SignatureTemplateServlet?action=delete&id=xxx | ลบ Template |

## Database Schema (แนะนำ)

```sql
CREATE TABLE signature_templates (
  id          VARCHAR(20)  PRIMARY KEY,
  name        VARCHAR(200),
  doc_type    VARCHAR(100),
  status      VARCHAR(20),
  json_config TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
