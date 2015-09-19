import boto3
import boto3.dynamodb
import simplejson
import os

import json
import decimal
from boto3.dynamodb.conditions import Key, Attr
from flask import Flask, render_template

PROPAGATE_EXCEPTIONS=1
AWS_REGION = 'us-east-1'

s3 = boto3.resource('dynamodb',region_name = AWS_REGION);
app = Flask(__name__);

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

port = int(os.environ.get('PORT', 5000)) 
if __name__ == "__main__":
    app.run(debug=True,port=port,host='0.0.0.0')

