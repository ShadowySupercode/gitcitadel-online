#Copyright (c) Vaughn Nugent

#use plain ubuntu latest to build native libraries in
FROM ubuntu:22.04 as native-cont

#install public libs and build tools
RUN apt update && apt install -y build-essential cmake git

#download and install task (faster than package manager)
ADD --checksum=sha256:d4ea84524cc4e0969e84f063fc99b9aba2090ec259c00a2e12d9ed1a182cf6af \
  https://github.com/go-task/task/releases/download/v3.39.2/task_linux_amd64.deb \
  task_linux_amd64.deb

RUN dpkg -i task_linux_amd64.deb

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
COPY --from=native-cont /build/out/libvn_compress.so /app/lib/libvn_compress.so
COPY --from=native-cont /build/out/libvn_rpmalloc.so /app/lib/libvn_rpmalloc.so

#workdir 
WORKDIR /app

EXPOSE 8080/tcp

#configure the native heap
ENV VNLIB_SHARED_HEAP_FILE_PATH=/app/lib/libvn_rpmalloc.so \
  VNLIB_COMPRESS_DLL_PATH=/app/lib/libvn_compress.so 

#run the init script within dumb-init
ENTRYPOINT [ "dotnet", "webserver/VNLib.WebServer.dll", "--config", "config/config.yaml", "--input-off" ]

