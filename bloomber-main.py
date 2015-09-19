import boto3
import boto3.dynamodb
import simplejson
#import boto3.dynamodb.table
#from boto.dynamodb2.table import Table

import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key, Attr
from flask import Flask
#import boto3.dynamodb.table
PROPAGATE_EXCEPTIONS=1
# response = table.query(KeyConditionExpression = Key('Ticker').eq('ACRDTPV Index') & Key('Date').between('2012-01-01', '2012-06-30')

# );
# for i in response['Items']:
# 	#for key in i:
# 		for key in (i['Fields']['Value']):
# 			print i['Ticker'] + "key:" + key  + " " +i['Fields']['Value'][key];

#  table = s3.Table('2012');
s3 = boto3.resource('dynamodb');
app = Flask(__name__);

# def getrow(row):
# 	data = {};
# 	data['Ticker'] = row.get('Ticker');
# 	data['Description'] = row.get('Description');
# 	data['Type'] = row.get('Type');
# 	data['Units'] = row.get('Fields').get('Value').get('Units');
# 	data['Frequency'] = row.get('Fields').get('Value').get('Frequency');
# 	return data;

@app.route('/api/v1.0/catalogs', methods=['GET'])
def get_catalogs():
	# Print out bucket names
	table = s3.Table('Catalog');
	response = table.scan();
	return simplejson.dumps(response['Items']);

@app.route('/api/v1.0/data/country/<countryName>', methods=['GET'])
def get_catalog(countryName):
	# Print out bucket names
	table = s3.Table('Catalog');
	tickerMap = {};
	response = table.scan(FilterExpression='contains(Description,:countryName)',ExpressionAttributeValues={':countryName':countryName},Limit=100)
	table = s3.Table('2014');
	for row in response['Items']:
		tickerMap[row['Ticker']] = row;
		response1 = table.query(KeyConditionExpression=Key('Ticker').eq(row['Ticker']));
		row['values']=response1;
	return simplejson.dumps(tickerMap);
# @app.route('/api/v1.0/catalog/hello', methods=['GET'])
# def get_catalog():
# 	table = s3.Table('Catalog');
#  	response = table.scan();
#  	return simplejson.dumps(response['Items']);

if __name__ == "__main__":
    app.run(debug=True)

