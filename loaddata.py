#
#  Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
#  This file is licensed under the Apache License, Version 2.0 (the "License").
#  You may not use this file except in compliance with the License. A copy of
#  the License is located at
#
#  http://aws.amazon.com/apache2.0/
#
#  This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
#  CONDITIONS OF ANY KIND, either express or implied. See the License for the
#  specific language governing permissions and limitations under the License.
#
from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal
import urllib

dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')

table = dynamodb.Table('exchange_accounts')

with open("walletaddress.json") as json_file:
    file = json.load(json_file, parse_float = decimal.Decimal)
    for list in file:
       addressread = list['addresscli']

       print("Adding address:", addressread)

       url = "https://blockchain.info/balance?active=" + addressread
       response = urllib.urlopen(url)
       data = json.loads(response.read().decode())
       blc = data[addressread]['final_balance']
       print("Current balance:", blc)

       table.put_item(
           Item={
               'addresses': addressread,
               'balance':blc,
            }
        )
