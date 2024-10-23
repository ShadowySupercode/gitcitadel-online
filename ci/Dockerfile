#Copyright (c) Vaughn Nugent

#use plain ubuntu latest to build native libraries in
FROM ubuntu:22.04 as native-cont

#install public libs and build tools
RUN apt update && apt install -y build-essential cmake npm
#most universal way to use Task is from NPM
RUN npm install -g @go-task/cli

WORKDIR /build
 
#include local artifacts
COPY app/ .

#build internal libraries and copy the libraries to the /lib output directory
RUN mkdir out/ && task

#APP CONTAINER
#move into a clean dotnet ubuntu lean image
FROM mcr.microsoft.com/dotnet/runtime:8.0.10-jammy-chiseled as app-cont

LABEL name="gitcitadel/gc-online"
LABEL maintainer="GitCitadel <support@gitcitadel.eu>"
LABEL description="Runs the GitCitadel website"

#copy local artifacts again in run container
COPY app/ /app

#pull compiled libs from build container
COPY --from=native-cont /build/out /app/lib

RUN apt update && apt install -y gettext dumb-init

#workdir 
WORKDIR /app

EXPOSE 80/tcp

VOLUME /app/ssl
#expose an assets directory for custom assets install
VOLUME /app/usr/assets

#configure the native heap
ENV VNLIB_SHARED_HEAP_FILE_PATH=/app/lib/libvn_rpmalloc.so

#run the init script within dumb-init
ENTRYPOINT [ "dumb-init", "dotnet", "webserver/VNLib.WebServer.dll", "--config", "config/config.yaml", "--input-off" ]

