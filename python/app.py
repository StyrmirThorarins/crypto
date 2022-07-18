# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

import logging
from dash import Dash, html, dcc
import plotly.express as px
import pandas as pd
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()
# logging.basicConfig(level=logging.DEBUG)

app = Dash(__name__)


# fetch data
def fetch_data(crypto_acronyms):
    df = pd.DataFrame()

    for acronym in crypto_acronyms:
        data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={
            'fsym': acronym, 'tsym': 'USD', 'limit': '10', 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})
        df = pd.DataFrame(data.json()['Data']['Data'])

    return px.line(df, x='time', y="open")

# set up plotly graph, https://plotly.com/python/px-arguments/
# https://community.plotly.com/t/announcing-plotly-py-4-8-plotly-express-support-for-wide-and-mixed-form-data-plus-a-pandas-backend/40048/10
fig = px.line()
fig = fetch_data(['BTC', 'ETH'])


# create app html
app.layout = html.Div(children=[
    html.H1(children='Crypto Demo with Python, Plotly and Flask'),

    html.Label('Select the crypto currencies you want to compare:'),
    html.Br(),
    dcc.Checklist(['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'BUSD', 'XRP', 'ADA', 'SOL', 'DOGE']),

    # render plotly graph
    dcc.Graph(
        id='crypto-graph',
        figure=fig
    )
], style={'padding': 10, 'flex': 1})


# run the app
if __name__ == '__main__':
    app.run_server(debug=False)
