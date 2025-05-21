# Как сделать форму регистрации красивой и современной

1. **Добавь Google Fonts (Montserrat)**
   
   В файл `Front/task-manager-frontend/src/index.html` в секцию `<head>` добавь:
   ```html
   <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
   ```

2. **Создай файл стилей для компонента**
   
   Сохрани SCSS из файла `register.component.scss` рядом с компонентом:
   ```
   /src/app/components/register.component.scss
   ```

3. **Убедись, что компонент подключает styleUrls**
   
   В `register.component.ts` должно быть:
   ```typescript
   @Component({
     // ...
     styleUrls: ['./register.component.scss']
   })
   ```

4. **Если используешь глобальные стили**
   
   Можно добавить фон или шрифт и в `styles.scss`:
   ```scss
   body {
     font-family: 'Montserrat', Arial, sans-serif;
     background: linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%);
     min-height: 100vh;
   }
   ```

5. **Перезапусти приложение**
   
   После изменений перезапусти Angular (`ng serve`), чтобы SCSS применился.

---

**Теперь твоя форма регистрации будет выглядеть современно, ярко и презентабельно!**