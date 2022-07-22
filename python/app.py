# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

import numpy as np
import pandas as pd
from urllib import response
from urllib.parse import urlparse
from urllib.parse import parse_qs
from dash import Dash, html, dcc
from flask import jsonify, request, render_template
import plotly.express as px
import requests
import os
from dotenv import load_dotenv  # to load .env variables
import logging
from datetime import datetime
# https://flask-cors.readthedocs.io/en/latest/#:~:text=Simple%20Usage,CORS(app)%20%40app.
from flask_cors import CORS
from dash.dependencies import Input, Output
from selenium import webdriver

load_dotenv()
logging.basicConfig(level=logging.DEBUG)


app = Dash(__name__, url_base_pathname='/')
server = app.server
CORS(app.server)

### ROUTES START ###

#cryptos_global = ''
#@server.route('/<cryptos>')
#def root_route(cryptos):
#    global cryptos_global
#    cryptos_global = cryptos
#
#    logging.debug("root_route: %s", cryptos)
#
#    return cryptos_global

@server.route('/graph/<cryptos>')
def route_graph(cryptos):
    layout = getLayout(cryptos, 365)

    # return jsonify({'message':'route_graph > {cryptos}'.format(cryptos=cryptos)})
    return app.data

@server.route('/test')
def route_test():
    layout =  html.Div(children=[
    html.H1(children='This is our Home page'),

    html.Div(children='''
        This is our Home page content.
    '''),
    ])
    return layout

### ROUTES END ###

def serve_layout(s: str):
    return html.H1('Serving Layout: {}'.format(s))


# return crypto list from args
def getCryptoList(args: str):
    cryptos = args.split(',')

    return cryptos


# fetch data from API
def fetch_data(crypto_acronyms: list[str], days: int = 30):
    df = pd.DataFrame()
    df_join = pd.DataFrame()

    print('crypto_acronyms', crypto_acronyms)

    for acronym in crypto_acronyms:
        logging.debug("fetching data for %s", acronym)
        data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={
            'fsym': acronym, 'tsym': 'USD', 'limit': days, 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})
        df = pd.DataFrame(data.json()['Data']['Data'])
        df['crypto'] = acronym
        df['time'] = df['time'].apply(lambda x: datetime.fromtimestamp(x))
        df = df[['crypto', 'time', 'open', 'high',
                 'low', 'close', 'volumefrom', 'volumeto']]
        df_join = pd.concat([df_join, df], axis=0, ignore_index=True)
        print('fetch_data df\n', df_join, df)

    fg = px.line(df_join, x='time', y='open', color='crypto', title='Crypto Prices for the last {} days'.format(days))

    return fg


# returns app.layout, including plotly graph
# @param cryptos_args: ',' seperated list of cryptocurrency acronyms | days: number of days to fetch
def getLayout(cryptos_args: str = '', days: int = 30):
    print('getLayout', cryptos_args)
    cryptos_args = cryptos_args.strip()
    cryptos = cryptos_args.split(',')
    #print('cryptos_args', cryptos_args, cryptos)

    # set up plotly graph, https://plotly.com/python/px-arguments/
    # https://community.plotly.com/t/announcing-plotly-py-4-8-plotly-express-support-for-wide-and-mixed-form-data-plus-a-pandas-backend/40048/10
    fig = fetch_data(cryptos, days)

    layout = html.Div(children=[
        # render plotly graph
        dcc.Graph(
            id='crypto-graph',
            figure=fig
        )
    ])

    return layout



app.config.suppress_callback_exceptions = True

app.layout = html.Div([
    # represents the URL bar, doesn't render anything
    dcc.Location(id='url', refresh=True),

    # content will be rendered in this element
    html.Div(id='content'),
])


# updates page content when URL changes
@app.callback(Output('content', 'children'),
              [Input('url', 'href')])
def _content(href: str):
    parsed_url = urlparse(href)
    print('parsed_url', parsed_url)
    cryptos_string = parse_qs(parsed_url.query)['cryptos'][0]
    print('cryptos_string', cryptos_string)

    content = ''
    if cryptos_string != '':
        content = getLayout(cryptos_string, 365)
    else:
        content = html.Div(children=[
            'Select cryptocurrencies to display in the graph.'
        ])

    return content


# run the app
if __name__ == '__main__':
    app.run_server(debug=True, port=8050)