
# GitCitadel Online

Repo containing the basic webpages for our [GitCitadel project](https://github.com/ShadowySupercode), including the Alexandria reader and publisher, the server monitoring page, and the possibility to submit PRs and issues to our software projects over [ngit events](https://gitworkshop.dev/ngit).

Feel free to contact us over [Nostr](https://nosta.me/nprofile1qqsggm4l0xs23qfjwnkfwf6fqcs66s3lz637gaxhl4nwd2vtle8rnfqprfmhxue69uhhg6r9vehhyetnwshxummnw3erztnrdaksz8mhwden5te0dehhxarj9ejkjmn4dej85ampdeaxjeewwdcxzcm9j3xeaa) or email us at [support@gitcitadel.eu](mailto:support@gitcitadel.eu).

## Building the server package

[Taskfile.dev](https://taskfile.dev/install) is required for platform agnostic build scripts. 

``` shell
task -t module.taskfile.yaml build
```
The output will be written to the `out/` directory, and can be archived and deployed to the server. The container must be built locally, all necessary files are included in package. An internet connection is required for the build process, and the server must have access to the internet to download the necessary dependencies.

## Building the container
A Dockerfile is included in the pacakge directory, along with a docker-compose file. The container can be built using the following command:

``` shell
docker-compose up --build
```
Or
``` shell
docker build -t gitcitadel/gc-online .
```

## Build cleanup

Cleans up the output of the build process.
``` shell
task -t module.taskfile.yaml clean
```