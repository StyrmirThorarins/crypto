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



def serve_layout(s: str):
    return html.H1('Serving Layout: {}'.format(s))


# return crypto list from args
def getCryptoList(args: str):
    cryptos = args.split(',')

    return cryptos


# fetch data from API
def fetch_graph_data(crypto_acronyms: list[str], days: int = 30):
    df = pd.DataFrame()
    df_join = pd.DataFrame()
    data = str

    for acronym in crypto_acronyms:
        logging.debug("fetching data for %s", acronym)

        try:
            data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={
                'fsym': acronym, 'tsym': 'USD', 'limit': days, 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})

            data_json = data.json()['Data']['Data']

            # not all cryptos have available data, skip if no data
            if (data_json == None):
                logging.debug("data returned is None, for %s", acronym)
                continue
            else:
                logging.debug("data found for %s", acronym)

                df = pd.DataFrame(data_json)
                df['crypto'] = acronym
                df['time'] = df['time'].apply(
                    lambda x: datetime.fromtimestamp(x))
                df = df[['crypto', 'time', 'open', 'high',
                        'low', 'close', 'volumefrom', 'volumeto']]
                df_join = pd.concat([df_join, df], axis=0, ignore_index=True)
        except Exception as e:
            logging.error("fetch_graph_data error: %s", e)

    # if the data frame used to construct the graph is empty return nothing
    if(df_join.empty):
        return None
    else:
        return px.line(df_join, x='time', y='open', color='crypto', title='Crypto Prices for the last {} days'.format(days))


# returns app.layout, including plotly graph
# @param cryptos_args: ',' seperated list of cryptocurrency acronyms | days: number of days to fetch
def get_page_content(cryptos_args: str = '', days: int = 30):
    cryptos_args = cryptos_args.strip()
    cryptos = cryptos_args.split(',')

    # set up plotly graph, https://plotly.com/python/px-arguments/
    # https://community.plotly.com/t/announcing-plotly-py-4-8-plotly-express-support-for-wide-and-mixed-form-data-plus-a-pandas-backend/40048/10
    fig = fetch_graph_data(cryptos, days)

    # return graph if data found, otherwise return a message for the user
    if (fig == None):
        return html.Div(children=[
            html.Div(children='''
                No data available for the selected crypto currency.
            '''),
        ], style={'color': "white", 'marginTop': 24})
    else:
        return html.Div(children=[
            # render plotly graph
            dcc.Graph(
                id='crypto-graph',
                figure=fig
            )
        ])


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
    cryptos_string = parse_qs(parsed_url.query)['cryptos'][0]
    content = ''

    if cryptos_string != None:
        content = get_page_content(cryptos_string, 365)
    else:
        content = html.Div(children=[
            'Select cryptocurrencies to display in the graph.'
        ])

    return content


# run the app
if __name__ == '__main__':
    app.run_server(debug=False, port=8050)
