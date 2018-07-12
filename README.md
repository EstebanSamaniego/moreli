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
```bash
cd module-db
chmod +x ./installDB.sh
./installDB.sh
npm i
npm run setup -- --yes
```

## application
in progress...

## frontend (vue)
in progress...

## backend (mqtt)
in progress...

## backend (api)
in progress...
