import boto3
import boto3.dynamodb
import simplejson
import os
#import boto3.dynamodb.table
#from boto.dynamodb2.table import Table

import json
import decimal
from boto3.dynamodb.conditions import Key, Attr
from flask import Flask, render_template

#import boto3.dynamodb.table
PROPAGATE_EXCEPTIONS=1
AWS_REGION = 'us-east-1'
# response = table.query(KeyConditionExpression = Key('Ticker').eq('ACRDTPV Index') & Key('Date').between('2012-01-01', '2012-06-30')

# );
# for i in response['Items']:
# 	#for key in i:
# 		for key in (i['Fields']['Value']):
# 			print i['Ticker'] + "key:" + key  + " " +i['Fields']['Value'][key];

#  table = s3.Table('2012');
s3 = boto3.resource('dynamodb',region_name = AWS_REGION);
app = Flask(__name__);

# def getrow(row):
# 	data = {};
# 	data['Ticker'] = row.get('Ticker');
# 	data['Description'] = row.get('Description');
# 	data['Type'] = row.get('Type');
# 	data['Units'] = row.get('Fields').get('Value').get('Units');
# 	data['Frequency'] = row.get('Fields').get('Value').get('Frequency');
# 	return data;

@app.route('/')
def index():
	return render_template('index.html')

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
		row['values']=response1['Items'];
	return simplejson.dumps(tickerMap);
# @app.route('/api/v1.0/catalog/hello', methods=['GET'])
# def get_catalog():
# 	table = s3.Table('Catalog');
#  	response = table.scan();
#  	return simplejson.dumps(response['Items']);
port = int(os.environ.get('PORT', 5000)) 
if __name__ == "__main__":
    app.run(debug=True,port=port,host='0.0.0.0')

