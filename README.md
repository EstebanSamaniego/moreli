# moreli
moreLi (More Live) is a open source program by automate the watering of plants

# Requirements
## postgressql
```bash
brew install postgresql
brew services start postgresql
```

# setup
## utils
```bash
cd module-utils
npm i
```

## db
Just one once
```bash
chmod +x ./installDB.sh
./installDB.sh
```


```bash
cd module-db
npm i
npm run setup -- --yes
```

## slave
in progress...

## frontend (vue)
in progress...

## backend (mqtt)
```bash
cd module-mqtt
npm i
npm run start || npm run start-dev
```

## backend (api)
in progress...
