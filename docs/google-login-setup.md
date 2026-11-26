# חיבור התחברות גוגל אמיתית (כ־15 דקות, פעם אחת)

הקוד מוכן. נשאר לפתוח שלושה חשבונות שרק אתה יכול לפתוח, כולם בחינם.
בסוף יהיו לך שני ערכים (כתובת ומפתח ציבורי) לתת לי. אני אכניס אותם, והאתר יעלה עם התחברות.

האתר: https://tamirdgani.github.io/tsmicha/

---

## 1. Supabase: מסד הנתונים ששומר את ההתקדמות

1. נכנסים ל־https://supabase.com ונרשמים (הכי קל: **Continue with GitHub**).
2. **New project**:
   - שם: `tsmicha`
   - אזור (Region): **Central EU (Frankfurt)**, הכי קרוב לישראל
   - בוחרים סיסמה למסד הנתונים ושומרים אותה אצלך (אני לא צריך אותה)
3. כשהפרויקט מוכן (כשתי דקות): בתפריט הצד **SQL Editor** ← **New query**.
   מעתיקים את כל התוכן של הקובץ [`supabase/learners.sql`](../supabase/learners.sql), מדביקים ולוחצים **Run**.
   צריך להופיע "Success". זה יוצר את הטבלה, וכל חשבון רואה רק את ההתקדמות שלו.

## 2. Google Cloud: אישור להתחבר עם חשבון גוגל

1. נכנסים ל־https://console.cloud.google.com ויוצרים פרויקט חדש (בתפריט למעלה: **New Project**) בשם `tsmicha`.
2. **APIs & Services** ← **OAuth consent screen** ← **Get started**:
   - שם האפליקציה: `צמיחה`, מייל תמיכה: המייל שלך
   - קהל (Audience): **External**
   - מסיימים, ואז ב־**Audience** לוחצים **Publish app**, כדי שכל אחד יוכל להתחבר ולא רק משתמשי ניסיון.
     האפליקציה מבקשת רק שם ומייל, ולכן גוגל לא דורשת בדיקה.
3. **APIs & Services** ← **Credentials** ← **Create credentials** ← **OAuth client ID**:
   - סוג: **Web application**
   - תחת **Authorized redirect URIs** מוסיפים את הכתובת ש־Supabase נותן:
     ב־Supabase נכנסים ל־**Authentication** ← **Sign In / Providers** ← **Google**, ויש שם **Callback URL** שנראה כמו
     `https://xxxx.supabase.co/auth/v1/callback`. מעתיקים אותו לכאן.
   - **Create**. מקבלים **Client ID** ו־**Client secret**.

## 3. חזרה ל־Supabase: מחברים את גוגל

1. **Authentication** ← **Sign In / Providers** ← **Google**: מפעילים (Enable), מדביקים את ה־Client ID ואת ה־Client secret, **Save**.
   (את ה־Client secret מדביקים רק כאן. לא שולחים אותו אליי ולא לאף אחד.)
2. **Authentication** ← **URL Configuration**:
   - **Site URL**: `https://tamirdgani.github.io/tsmicha/`
   - **Redirect URLs**: מוסיפים `https://tamirdgani.github.io/tsmicha/` וגם `http://localhost:5190/`

## 4. שולחים לי את שני הערכים

ב־Supabase: **Project Settings** ← **API** (או **Data API**):
- **Project URL** (נראה כמו `https://xxxx.supabase.co`)
- המפתח **anon public** (מחרוזת ארוכה שמתחילה ב־`eyJ`)

שני הערכים האלה ציבוריים מלכתחילה. הם נכנסים לכל אתר, והאבטחה באה מחוקי הטבלה שבשלב 1. אפשר לשלוח לי אותם בצ'אט,
ואני אכניס אותם ל־GitHub, אעלה את האתר מחדש ואבדוק התחברות.

---

## מה קורה אחר כך

- באייפד ובכל מכשיר אחר: פותחים את https://tamirdgani.github.io/tsmicha/, מתחברים עם חשבון הגוגל שלך, וההתקדמות זהה בכל מקום.
  כדאי להוסיף את האתר למסך הבית של האייפד (שיתוף ← הוספה למסך הבית).
- **ההתקדמות של לני עד עכשיו** שמורה בדפדפן שבו הוא שיחק (הקישור של Claude). פותחים את הקישור הזה פעם אחרונה,
  לוחצים על התמונה למעלה ← **"מעבר לאתר עם התחברות גוגל"**. ההתקדמות עוברת לאתר החדש, ובהתחברות הראשונה נשמרת בענן.
- אם שיחקו על שני מכשירים בלי אינטרנט, שום דבר לא הולך לאיבוד: כשהם מתחברים, השיעורים שהושלמו מתאחדים והניקוד הגבוה נשמר.
