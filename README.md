# Kinolar sayti - Backend (NestJS + TypeScript + Prisma + ffmpeg)

`4-oy.md` texnik topshirig'i asosida yozilgan to'liq backend. **2-versiya o'zgarishlari:**
cookie autentifikatsiyasi olib tashlandi (faqat Bearer token), TZ dagi qolib ketgan qismlar
qo'shildi (watch history, superadmin funksiyalari, refresh token) va video fayllar
**fluent-ffmpeg** orqali tanlangan sifatga avtomatik o'tkaziladi.

## 1. O'rnatish

```bash
pnpm install          # ffmpeg-static shu paytda ffmpeg binariyasini ham yuklab oladi
cp .env.example .env  # DATABASE_URL, JWT_SECRET va boshqalarni to'ldiring
npx prisma generate
npx prisma migrate dev --name init
pnpm start:dev
```

Swagger: `http://localhost:3000/swagger` | API prefiks: `/api/v1`

## 2. Autentifikatsiya (cookie YO'Q, faqat Bearer token)

- `POST /api/v1/auth/login` javobida `accessToken` (30 daqiqa) va `refreshToken` (7 kun) keladi
- Har bir himoyalangan so'rovda header yuboriladi: `Authorization: Bearer <accessToken>`
- Access token eskirsa: `POST /api/v1/auth/refresh` ga `{ "refreshToken": "..." }` yuborib yangisini olinadi
- `POST /api/v1/auth/logout` - JWT stateless bo'lgani uchun server hech narsa o'chirmaydi,
  frontend o'zidagi tokenlarni o'chirib tashlashi kifoya

## 3. Video qayta ishlash (fluent-ffmpeg)

`POST /api/v1/admin/movies/:movie_id/files` ga video yuklanganda:

1. Multer asl faylni `src/uploads/movies` ga vaqtincha saqlaydi
2. `VideoService` (src/core/video/video.service.ts) **fluent-ffmpeg** orqali videoni
   tanlangan sifatga o'tkazadi: razmer (240p...4K), video/audio bitrate, H.264 + AAC kodek,
   `+faststart` (internetda darhol o'ynay boshlashi uchun)
3. Bazaga qayta ishlangan fayl yoziladi, asl fayl o'chiriladi

**Muhim:** `fluent-ffmpeg` o'zi video ishlamaydi - u kompyuterdagi `ffmpeg` dasturini chaqiradi.
`ffmpeg-static` paketi ffmpeg binariyasini npm install paytida avtomatik yuklab keladi,
shuning uchun ffmpeg'ni qo'lda o'rnatish shart emas.

**Ogohlantirish:** transcode so'rov ichida await qilinadi - katta fayllar uchun so'rov uzoq
davom etadi. Haqiqiy production'da bu ish navbat (BullMQ + Redis) orqali fonda bajarilishi kerak.

## 4. Endpointlar xaritasi

| Guruh | Endpointlar | Kim uchun |
|---|---|---|
| Auth | POST /auth/register, /login, /refresh, /logout | hamma |
| Profile | GET, PUT /profile | login qilgan |
| Subscription | GET /subscription/plans (ochiq), POST /subscription/purchase | login qilgan |
| Categories | GET /categories (ochiq) | hamma |
| Movies | GET /movies, GET /movies/:slug (ochiq; premium fayllar obunaga qarab) | hamma |
| Favorites | GET, POST /favorites, DELETE /favorites/:movie_id | login qilgan |
| Reviews | POST, DELETE /movies/:movie_id/reviews | login qilgan (delete: egasi yoki admin) |
| Watch history | GET, POST /watch-history, DELETE /watch-history/:movie_id | login qilgan |
| Admin | GET/POST /admin/movies, PUT/DELETE /admin/movies/:id, POST /admin/movies/:id/files, /admin/categories CRUD | ADMIN, SUPERADMIN |
| Superadmin | GET/POST/DELETE /superadmin/admins, GET/POST/PUT/DELETE /superadmin/plans | faqat SUPERADMIN |

## 5. Loyiha tuzilishi

```
src/
 ├─ core/
 │   ├─ database/   -> PrismaService (PostgreSQL ulanish)
 │   ├─ utils/      -> GenerateToken (JWT access/refresh)
 │   └─ video/      -> VideoService (fluent-ffmpeg transcode)  [YANGI]
 ├─ common/
 │   ├─ guards/     -> AuthGuard (Bearer), OptionalAuthGuard, RoleGuard
 │   ├─ decorators/ -> @Roles(), @CurrentUser()
 │   └─ seeders/    -> superadmin + Free/Premium rejalarini avtomatik yaratadi
 └─ modules/
     ├─ auth, profile, subscriptions, categories, movies, favorites, reviews
     ├─ watch-history  [YANGI] -> ko'rish tarixi, "Davom ettirish" funksiyasi
     ├─ admin          -> kinolar CRUD + ffmpeg orqali fayl yuklash
     └─ superadmin     [YANGI] -> adminlarni va obuna rejalarini boshqarish
```
