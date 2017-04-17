# flnotifier

Расширение google chrome для получения уведомлений о новых проектах от биржи фриланса FL.RU.

## Установка среды для разработки.
Папка ext - рабочая папка расширения.
Папка src - вспомогательные файлы стилей и скриптов. Эти файлы будут автоматом помещаться в папку ext(необходимо включить gulp watch - смтр. ниже)

+ Необходимо установить npm глобально.
+ Перейти в папку проекта и запустить 
 ```
 npm i
 ```
+ Запустить в папке проекта команду
```
gulp
```

Для запуска наблюдения за файлами в папке src необходимо выполнить команду 
```
gulp watch
```
Для единоразового обновления файлов запуск команд

```
gulp minCss
gulp minJs
```
