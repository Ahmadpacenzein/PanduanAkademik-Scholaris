# PROJECT_UPGRADE.md

## Project Overview

Project Name: **Scholaris - Academic Mobile Application**

This project is an extension of the previous Scholaris React Native Expo application.

**IMPORTANT RULES**

* DO NOT redesign UI.
* DO NOT change colors, theme, glassmorphism, spacing, typography, icons, or component styles.
* DO NOT rename existing screens.
* DO NOT remove existing features.
* ONLY extend functionality.
* Preserve current Navigation structure.
* Preserve AsyncStorage implementation already used.
* Preserve Dark Mode and ThemeContext.

---

# Existing Features (DO NOT MODIFY)

Already implemented:

* Splash Screen
* Bottom Navigation
* Stack Navigation
* Passing Params
* AsyncStorage
* CRUD Courses
* Profile Screen
* Settings Screen
* Search Courses
* Filter Courses
* Intent:

  * Phone
  * WhatsApp
  * Email
  * Maps
  * Share

---

# NEW FEATURES TO IMPLEMENT

## 1. Networking Layer

Create:

```text
src/services/apiService.js
```

Using:

```bash
axios
```

Install:

```bash
npm install axios
```

---

Functions:

### getCoursesFromServer()

Fetch courses from:

```text
https://dummyjson.com/products
```

Map data into course structure:

```js
{
 id,
 name,
 code,
 credits,
 lecturer,
 description
}
```

---

### postCourseToServer(course)

POST course:

```text
https://jsonplaceholder.typicode.com/posts
```

Return response.

---

### mergeServerAndLocal()

Merge:

```text
AsyncStorage courses
+
Server courses
```

Avoid duplicate IDs.

---

# 2. Sync Button

Inside:

```text
CourseListScreen.js
```

Add:

```text
Sync From Server
```

Behavior:

Button pressed

↓

Fetch latest courses

↓

Merge with AsyncStorage

↓

Update FlatList

↓

Show success message

---

# 3 Pull To Refresh

Implement:

```jsx
RefreshControl
```

In:

```text
CourseListScreen
```

Behavior:

Pull

↓

Fetch server

↓

Merge local

↓

Refresh list

---

# 4 Online Offline Status

Install:

```bash
npx expo install @react-native-community/netinfo
```

Create:

```text
src/context/NetworkContext.js
```

Provide:

```js
isConnected
```

Display:

```text
🟢 Online

or

🔴 Offline
```

Inside:

```text
HomeScreen
```

DO NOT change layout.

Add only small status badge.

---

# 5 Local Cache

When fetch succeeds:

Save to:

```text
AsyncStorage
```

Keys:

```text
courses_cache
```

If offline:

Load:

```text
courses_cache
```

Automatically.

---

# 6 Background Fetch

Install:

```bash
npx expo install expo-background-fetch
npx expo install expo-task-manager
```

Create:

```text
src/background/backgroundTask.js
```

Task:

Every 30 minutes:

1. Fetch courses from API

2. Merge local storage

3. Save cache

4. Trigger notification if new course exists

---

Register background task:

Inside:

```text
App.js
```

without changing UI.

---

# 7 Local Notification

Install:

```bash
npx expo install expo-notifications
```

Create:

```text
src/services/notificationService.js
```

Functions:

### registerNotification()

Ask permission.

---

### sendCourseNotification(course)

Example:

Title:

```text
Mata Kuliah Baru
```

Body:

```text
AI Generatif - 3 SKS tersedia
```

---

Trigger:

When:

```text
Background Sync detects new course
```

---

# 8 Auto Sync on App Open

When app opens:

Automatically:

```text
Fetch server

↓

Merge local

↓

Update storage

↓

Refresh UI
```

Implement without changing existing UI.

---

# 9 Error Handling

Every API request must have:

```js
try {

}catch(error){

}
```

Add:

* loading state
* retry once
* offline fallback
* toast / alert message

---

# File Structure After Upgrade

```text
src

├── background
│   └── backgroundTask.js

├── context
│   └── NetworkContext.js

├── services
│   ├── apiService.js
│   ├── notificationService.js
│   ├── courseService.js
│   └── studentService.js

├── screens
│   └── KEEP EXISTING SCREENS

├── utils
│   └── storageManager.js
```

---

# FINAL REQUIREMENT

The final application MUST:

✅ Keep existing Scholaris UI

✅ Keep glassmorphism design

✅ Keep Bottom Navigation

✅ Keep Dark Mode

✅ Keep existing CRUD

✅ Add Networking

✅ Add Background Sync

✅ Add Notifications

✅ Add Online Offline Status

✅ Add Pull To Refresh

✅ Add Auto Sync

WITHOUT changing visual design.
