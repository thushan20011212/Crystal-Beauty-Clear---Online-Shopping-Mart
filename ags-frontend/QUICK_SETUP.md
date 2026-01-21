# 🚀 Quick Setup Guide - Hero Gallery

## ⚡ 3 Simple Steps to Get Started

### Step 1️⃣: Add Your Images

Place these 4 images in the `public/imageser/` folder:

```
ags-frontend/
  └── public/
      └── imageser/          👈 Create this folder if it doesn't exist
          ├── image (6).jpg  ✅ Add this
          ├── image (7).jpg  ✅ Add this
          ├── image (8).jpg  ✅ Add this
          └── image (9).jpg  ✅ Add this
```

### Step 2️⃣: Start the Dev Server

```bash
cd ags-frontend
npm run dev
```

### Step 3️⃣: Open in Browser

```
http://localhost:5174/
```

---

## 🎨 What You'll See

### **Hero Section with Auto-Changing Gallery**

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Left: Your Text Content]           │
│                                             │
│   • Avanaa Glowy Square                     │
│   • Description                             │
│   • Buttons                                 │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  L-Border            [Right: Auto Gallery]  │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │      [Your Product Images]            │  │
│  │      Auto-changing every 3.5s         │  │
│  │      Smooth crossfade transitions     │  │
│  │                                       │  │
│  │      • • • •  (Clickable dots)        │  │
│  └───────────────────────────────────────┘  │
│                              L-Border      │
└─────────────────────────────────────────────┘
```

---

## ✨ Features

### **Automatic**
- Changes every 3.5 seconds
- Smooth 1-second fade
- Infinite loop

### **Interactive** 
- Click dots to jump to any image
- Hover effects on all elements

### **Visual Only**
- NO text on images
- NO symbols or badges
- Pure visual beauty

---

## 📸 Image Requirements

### **Format**
- JPG format recommended
- Any resolution (will be auto-scaled)

### **Naming** (Must match exactly)
- `image (6).jpg` - with space and parentheses
- `image (7).jpg` - with space and parentheses  
- `image (8).jpg` - with space and parentheses
- `image (9).jpg` - with space and parentheses

---

## 🎯 Quick Test

1. Add 4 images to `public/imageser/`
2. Run `npm run dev`
3. Open browser
4. Watch images auto-change! ✨

---

**That's it! Your modern hero gallery is ready! 🎉**
