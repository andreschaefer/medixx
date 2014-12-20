#!/bin/bash

#####
# Helper script for pretty formatting of json files
#####

for file in `ls -a app/medics | grep -v \\\.\$`; do
  cat app/medics/$file | python -mjson.tool > tmp.json
  rm app/medics/$file
  mv tmp.json app/medics/$file
done
