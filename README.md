# amotest

npm install
npm run dev
open http://localhost:5173/ in browser

## to get access token use bash:

```bash
curl https://ivanshum.amocrm.ru/oauth2/access_token -d \
'{"client_id":"<Id интеграции>","client_secret":"<Секретный ключ>","grant_type":"authorization_code","code":"<Код авторизации>","redirect_uri":"https://ivanshum.amocrm.ru"}' \
-H 'Content-Type:application/json' \
-X POST
```
