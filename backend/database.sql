-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: biletbul
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Bilet`
--

DROP TABLE IF EXISTS `Bilet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bilet` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `KullaniciId` int NOT NULL,
  `EtkinlikId` int NOT NULL,
  `KoltukNo` varchar(10) DEFAULT NULL,
  `SatisTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `Fiyat` decimal(10,2) DEFAULT NULL,
  `Durum` varchar(20) DEFAULT 'aktif',
  PRIMARY KEY (`Id`),
  KEY `KullaniciId` (`KullaniciId`),
  KEY `EtkinlikId` (`EtkinlikId`),
  CONSTRAINT `Bilet_ibfk_1` FOREIGN KEY (`KullaniciId`) REFERENCES `Kullanici` (`Id`),
  CONSTRAINT `Bilet_ibfk_2` FOREIGN KEY (`EtkinlikId`) REFERENCES `Etkinlik` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bilet`
--

LOCK TABLES `Bilet` WRITE;
/*!40000 ALTER TABLE `Bilet` DISABLE KEYS */;
INSERT INTO `Bilet` VALUES (3,1,3,'D-10','2026-05-08 01:49:17',400.00,'iade'),(4,1,3,'F-5','2026-05-08 01:49:17',400.00,'iade'),(5,1,2,'B-5','2026-05-08 02:35:43',1200.00,'iade'),(6,1,2,'B-6','2026-05-08 02:35:43',1200.00,'iade'),(7,1,3,'H-12','2026-05-08 02:52:22',400.00,'iade'),(8,1,3,'A-2','2026-05-08 03:03:26',400.00,'aktif');
/*!40000 ALTER TABLE `Bilet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Etkinlik`
--

DROP TABLE IF EXISTS `Etkinlik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Etkinlik` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Ad` varchar(200) NOT NULL,
  `Mekan` varchar(200) DEFAULT NULL,
  `Tarih` datetime DEFAULT NULL,
  `ToplamKoltuk` int DEFAULT '0',
  `SatilanKoltuk` int DEFAULT '0',
  `Fiyat` decimal(10,2) DEFAULT NULL,
  `Durum` varchar(20) DEFAULT 'aktif',
  `Aciklama` text,
  `ResimUrl` varchar(500) DEFAULT NULL,
  `OlusturmaTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `OrganizatorId` int DEFAULT NULL,
  `Kategori` varchar(50) DEFAULT 'konser',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Etkinlik`
--

LOCK TABLES `Etkinlik` WRITE;
/*!40000 ALTER TABLE `Etkinlik` DISABLE KEYS */;
INSERT INTO `Etkinlik` VALUES (2,'Harbiye Konser','Harbiye Açık Hava','2026-05-10 21:00:00',500,0,1200.00,'aktif','Tarkan konseri','https://picsum.photos/seed/konser1/800/600','2026-05-08 01:31:14',3,'konser'),(3,'Tiyatro Oyunu','Devlet Tiyatrosu','2026-05-12 21:00:00',300,1,400.00,'aktif','Devlet Tiyatrosu oyunu','https://picsum.photos/seed/tiyatro1/800/600','2026-05-08 01:31:14',3,'tiyatro'),(4,'Elektronik Festival','KüçükÇiftlik Park','2026-05-15 21:00:00',2000,0,2000.00,'aktif','DJ Set performansı','https://picsum.photos/seed/festival1/800/600','2026-05-08 01:31:14',3,'festival'),(5,'Büyük Konser','İstanbul Arena','2026-06-05 21:00:00',5000,0,1500.00,'aktif','Sezen Aksu konseri','https://picsum.photos/seed/konser2/800/600','2026-05-08 01:31:14',3,'konser'),(6,'Çocuk Tiyatrosu','Çocuk Merkezi','2026-06-10 21:00:00',200,0,350.00,'aktif','Çocuklara özel tiyatro','https://picsum.photos/seed/cocuk1/800/600','2026-05-08 01:31:14',3,'tiyatro'),(7,'Yaz Festival','KüçükÇiftlik Park','2026-06-20 21:00:00',2000,0,2000.00,'aktif','DJ Mert performansı','https://picsum.photos/seed/festival2/800/600','2026-05-08 01:31:14',3,'festival'),(8,'Stand-Up Show','BKM','2026-07-01 21:00:00',400,0,700.00,'aktif','Stand-up gösterisi','https://picsum.photos/seed/standup1/800/600','2026-05-08 01:31:14',3,'standup'),(9,'Müzik Atölyesi','Mall of İstanbul','2026-07-15 21:00:00',100,0,800.00,'aktif','Murat Boz müzik atölyesi','https://picsum.photos/seed/workshop1/800/600','2026-05-08 01:31:14',3,'workshop'),(10,'Blog Yazarlığı Semineri','İstanbul Üniversitesi','2026-08-02 21:00:00',150,0,350.00,'aktif','Yusuf Aydın semineri','https://picsum.photos/seed/blog1/800/600','2026-05-08 01:31:14',3,'blog'),(11,'Yoga ve Meditasyon','BKM','2026-08-10 21:00:00',80,0,450.00,'aktif','Ayşe Kucuk yoga etkinliği','https://picsum.photos/seed/yoga1/800/600','2026-05-08 01:31:14',3,'workshop'),(12,'Şiir Akşamı','Harbiye Açık Hava','2026-09-20 21:00:00',300,0,250.00,'aktif','İstanbul Şiir Grubu','https://picsum.photos/seed/siir1/800/600','2026-05-08 01:31:14',3,'tiyatro'),(13,'Klasik Müzik Konseri','Çırağan Sarayı','2026-09-25 21:00:00',600,0,1800.00,'aktif','İstanbul Senfoni Orkestrası','https://picsum.photos/seed/klasik1/800/600','2026-05-08 01:31:14',3,'konser'),(14,'Rock Festivali','KüçükÇiftlik Park','2026-10-10 21:00:00',3000,0,1000.00,'aktif','Manga rock festivali','https://picsum.photos/seed/rock1/800/600','2026-05-08 01:31:14',3,'festival'),(15,'Dünya Turu Gösterisi','BKM','2026-10-15 21:00:00',400,0,1200.00,'aktif','Yılmaz Erdoğan gösterisi','https://picsum.photos/seed/tiyatro2/800/600','2026-05-08 01:31:14',3,'tiyatro'),(16,'Jazz Konseri','KüçükÇiftlik Park','2026-11-01 21:00:00',800,0,1000.00,'aktif','Pinar Ayhan jazz konseri','https://picsum.photos/seed/jazz1/800/600','2026-05-08 01:31:14',3,'konser'),(17,'Edebiyat Akşamı','İstanbul Tiyatrosu','2026-11-10 21:00:00',200,0,550.00,'aktif','Metin Hara edebiyat akşamı','https://picsum.photos/seed/edebiyat1/800/600','2026-05-08 01:31:14',3,'blog');
/*!40000 ALTER TABLE `Etkinlik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kullanici`
--

DROP TABLE IF EXISTS `Kullanici`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Kullanici` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Ad` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `SifreHash` varchar(255) NOT NULL,
  `Rol` varchar(20) DEFAULT 'kullanici',
  `OlusturmaTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kullanici`
--

LOCK TABLES `Kullanici` WRITE;
/*!40000 ALTER TABLE `Kullanici` DISABLE KEYS */;
INSERT INTO `Kullanici` VALUES (1,'Fatma Aydoğan','faydogan.068@gmail.com','$2a$11$BPWzxyvTQaHtZgPyGOeXZeRXfQb30jiRAQs9NUSD2AHiDEGQdOUH.','kullanici','2026-05-08 01:37:12'),(2,'Admin','admin@biletbul.com','$2a$11$jbTdMCisEtg8Ye92mMp0sOwf7ceDibY9UkmhWQStnkRW8RpKHEbqK','admin','2026-05-08 01:39:53'),(3,'Organizatör','organizator@biletbul.com','$2a$11$QRHfN3yBajEkL.ZbTEouuu4ysaxo3y0FYeWARAPF3Lsgp0A/vn5x.','organizer','2026-05-08 01:56:36');
/*!40000 ALTER TABLE `Kullanici` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Odeme`
--

DROP TABLE IF EXISTS `Odeme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Odeme` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BiletId` int NOT NULL,
  `Tutar` decimal(10,2) DEFAULT NULL,
  `OdemeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `OdemeDurumu` varchar(20) DEFAULT 'basarili',
  `OdemeYontemi` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `BiletId` (`BiletId`),
  CONSTRAINT `Odeme_ibfk_1` FOREIGN KEY (`BiletId`) REFERENCES `Bilet` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Odeme`
--

LOCK TABLES `Odeme` WRITE;
/*!40000 ALTER TABLE `Odeme` DISABLE KEYS */;
/*!40000 ALTER TABLE `Odeme` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 14:31:08
