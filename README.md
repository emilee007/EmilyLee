# EmilyLee

## Development environment setup

1. Go to location of folder
```
cd ~/EmilyLee
```
2. Make sure you are on correct branch (currently `master` for old website)
3. Run sass with watch
```
sass --watch assets/sass/main.scss:assets/css/main.css
```
4. Launch web server (in new Terminal tab)
```
cd ~/EmilyLee
em
```

## To deploy to production

1. Make sure sass watch is no longer running by closing that tab
```
cd ~/EmilyLee
./deploy
```