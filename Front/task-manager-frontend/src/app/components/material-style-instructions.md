# Как сделать все формы красивыми и по центру

1. **Добавь Google Fonts (Montserrat)**
   
   В файл `Front/task-manager-frontend/src/index.html` в секцию `<head>`:
   ```html
   <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
   ```

2. **Создай SCSS-файлы для компонентов**
   
   - Для логина:  
     `/src/app/components/login.component.scss`
   - Для задач:  
     `/src/app/components/tasks.component.scss`
   - Для регистрации:  
     `/src/app/components/register.component.scss`  
     (уже был ранее)

3. **Убедись, что компоненты подключают styleUrls**
   
   В каждом компоненте должно быть:
   ```typescript
   @Component({
     // ...
     styleUrls: ['./имя-компонента.scss']
   })
   ```

4. **Перезапусти приложение**
   
   После изменений перезапусти Angular (`ng serve`), чтобы SCSS применился.

---

**Теперь все основные формы будут по центру, с красивым Material-дизайном и современным шрифтом!**