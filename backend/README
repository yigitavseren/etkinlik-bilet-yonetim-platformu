## 🔧 Backend (C# .NET Core API)

### 📋 Gereksinimler
- .NET 8 SDK
- MySQL 8.0

### 🚀 Backend'i Çalıştırma

**1. MySQL'i kurun ve başlatın:**
```bash
sudo apt install mysql-server -y
sudo systemctl start mysql
```

**2. Veritabanını kurun:**
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE biletbul;
EXIT;
```
```bash
mysql -u root -p biletbul < backend/database.sql
```

**3. `backend/appsettings.json` dosyasını oluşturun:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1;Port=3306;Database=biletbul;User=root;Password=SIFRENIZ;"
  },
  "Jwt": {
    "Key": "BiletBulGizliAnahtar123456789012",
    "Issuer": "BiletBulAPI",
    "Audience": "BiletBulClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**4. Backend'i başlatın:**
```bash
cd backend
dotnet run
```

API `http://localhost:5196` adresinde çalışacaktır.
