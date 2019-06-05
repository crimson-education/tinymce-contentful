#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -b|--bucket)
    BUCKET="$2"
    shift # past argument
    shift # past value
    ;;
    -p|--prefix)
    PREFIX="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

S3_PATH="${BUCKET}/${PREFIX}"
echo Deploying to s3 path = ${S3_PATH}

aws s3 sync ./src ${S3_PATH} --delete --exclude "nweb*" --acl public-read

echo Done.