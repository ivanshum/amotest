# amotest

npm install
npm run dev
open http://localhost:5173/ in browser

## Личные заметки

Токены лежат в .env если ACCESSTOKEN протух, то можно воспользоваться рефрешем, ну или передернуть интеграцию и получить заново
Хранить в репе не стоит конечно, но для теста можно.

## to get access token use bash:

```bash
curl https://ivanshum.amocrm.ru/oauth2/access_token -d \
'{"client_id":"<Id интеграции>","client_secret":"<Секретный ключ>","grant_type":"authorization_code","code":"<Код авторизации>","redirect_uri":"https://ivanshum.amocrm.ru"}' \
-H 'Content-Type:application/json' \
-X POST
```
