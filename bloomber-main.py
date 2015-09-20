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

countries = ['US','UK','India','Indonesia','Canada','Itlay','Japan','Mexico','Russia','South Africa'];


def getValue(values,units):
	val = 0
	for i in range(0,len(values)-1):
		val=val+values[i].get('Value') - values[i-1].get('Value');
	#print values;
	return val;

@app.route('/api/v1.0/data/<attributeName>/<year>')
def get_data_for_attribute(attributeName,year):
	table = s3.Table('Catalog');
	table1 = s3.Table(year)
	tickerMap = {};
	countryWiseData = {}
	response = table.scan(FilterExpression='contains(Description,:attributeName)',ExpressionAttributeValues={':attributeName':attributeName})
	for row in response['Items']:
		desc = row['Description'];
		for word in desc.split():
			found=0;
			for country in countries:
				if(country.lower() == word.lower()):
					if(countryWiseData.get(country) == None):
						countryWiseData[country] = [];
					countryWiseData[country].append(row)
					response1 = table1.query(KeyConditionExpression=Key('Ticker').eq(row['Ticker']));
					row['values'] = response1['Items'];
					found=1;
					break;
			if(found == 1):
				break;

	for country in countryWiseData:
		for economic_data in countryWiseData.get(country):
			freq = economic_data.get('Fields').get('Value').get('Frequency');
			units = economic_data.get('Fields').get('Value').get('Units');
			values=economic_data.get('values');
			val = getValue(values,units);
			if(val < 0):
				economic_data['indicator'] = -1;
			elif(val>0):
				economic_data['indicator'] = +1;
			else:
				economic_data['indicator'] = 0;
				
				


	return simplejson.dumps(countryWiseData);			

		

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
def get_data_for_country(countryName):
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

@app.route('/api/v1.0/data/country/<countryName>/<year>', methods=['GET'])
def get_data_for_country_per_year(countryName,year):
	# Print out bucket names
	table = s3.Table('Catalog');
	tickerMap = {};
	response = table.scan(FilterExpression='contains(Description,:countryName)',ExpressionAttributeValues={':countryName':countryName})
	table = s3.Table(year);
	for row in response['Items']:
		tickerMap[row['Ticker']] = row;
		response1 = table.query(KeyConditionExpression=Key('Ticker').eq(row['Ticker']));
		row['values']=response1['Items'];
	return simplejson.dumps(tickerMap);

port = int(os.environ.get('PORT', 5000)) 
if __name__ == "__main__":
    app.run(debug=True,port=port)

