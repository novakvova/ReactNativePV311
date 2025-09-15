@echo off

echo Changing directory api...

cd "WebAPIATB"

echo Building Docker image api...
docker build -t pv311-native-api . 

echo Tagging Docker image api...
docker tag pv311-native-api:latest novakvova/pv311-native-api:latest

echo Pushing Docker image api to repository...
docker push novakvova/pv311-native-api:latest

echo Done ---api---!
pause

