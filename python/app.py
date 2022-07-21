# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

import numpy as np
import pandas as pd
from urllib import response
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

load_dotenv()
logging.basicConfig(level=logging.DEBUG)


app = Dash(__name__, url_base_pathname='/app/')
server = app.server
CORS(app.server)

### ROUTES START ###


@server.route('/app/')
def route_app():
    logging.debug('route_app')
    fig = getFig()
    layout = getLayout(fig)

    return '<h1>app</h1>'
    # return layout


### ROUTES END ###


# fetch data
def fetch_data(crypto_acronyms):
    df = pd.DataFrame()

    for acronym in crypto_acronyms:
        logging.debug("fetching data for %s", acronym)
        data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={
            'fsym': acronym, 'tsym': 'USD', 'limit': '10', 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})
        df = pd.DataFrame(data.json()['Data']['Data'])
        df['crypto'] = acronym
        df['time'].astype('datetime64[ns]')
        #df['time'] = datetime.fromtimestamp(df['time'])
        print('fetch_data df\n', df)

    fg = px.line(df, x='time', y="open")
    return fg


# @param array of cryptocurrency acronyms
def getFig(cryptos):
    #list = request.args.get('crypto_list')

    # set up plotly graph, https://plotly.com/python/px-arguments/
    # https://community.plotly.com/t/announcing-plotly-py-4-8-plotly-express-support-for-wide-and-mixed-form-data-plus-a-pandas-backend/40048/10
    fig = fetch_data(cryptos)

    return fig

# returns app.layout, including plotly graph
def getLayout(fig):
    layout = html.Div(children=[
        # render plotly graph
        dcc.Graph(
            id='crypto-graph',
            figure=fig
        )
    ])
    return layout


#fig = getFig(['ETH', 'BTC'])
fig = getFig(['ETH'])
app.layout = getLayout(fig)


# run the app
if __name__ == '__main__':
    app.run_server(debug=True)
    print('args ', request.args)

    t = np.linspace(0, 2*np.pi, 100)

    fig = px.line(x=t, y=np.cos(t), labels={'x':'t', 'y':'cos(t)'})
    fig.show()
