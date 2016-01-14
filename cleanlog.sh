#!/bin/bash
set -ex

file="flask.log"
# delete the first line of the file
sed -i '1d' $file
grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" $file > iplist
