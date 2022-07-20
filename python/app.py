# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

from urllib import response
from dash import Dash, html, dcc
from flask import jsonify, request
import plotly.express as px
import pandas as pd
import requests
import os
from dotenv import load_dotenv  # to load .env variables
import logging
# https://flask-cors.readthedocs.io/en/latest/#:~:text=Simple%20Usage,CORS(app)%20%40app.
from flask_cors import CORS

load_dotenv()
logging.basicConfig(level=logging.DEBUG)


app = Dash(__name__, url_base_pathname='/app/')
server = app.server
CORS(app.server)


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
fig = fetch_data(['BTC'])


### ROUTES START ###

@server.route('/app/<crypto_list>')
def route_root():
    logging.debug('root route', crypto_list)
    fig = fetch_data(['ETH'])
    return jsonify({'message': 'this is route route'})


@server.route('/')
def route1():
    return jsonify({'message': 'this is the first route'})


@server.route('/test&<crypto_list>')
def route2(crypto_list):
    args = request.view_args['crypto_list']
    return jsonify({'message': 'this is the second route' + args})
    #return f'Test {crypto_list}'


@server.route('/test2')
def route3():
    response = "Hello World"
    return jsonify({'message': response})


# set up app API to return graph html
@server.route('/pyplotgraph')
def route_plotly_graph():
    fig = px.line()
    # fig = fetch_data(['BTC'])

    app.layout = html.Div(children=[
        html.H1(children='Crypto Demo with Python, Plotly and Flask'),

        html.Label('Select the crypto currencies you want to compare:'),
        html.Br(),

        # render plotly graph
        dcc.Graph(
            id='crypto-graph',
            figure=fig
        )
    ], style={'padding': 10, 'flex': 1})

    logging.debug('route_plotly_graph', app.layout)
    # json_response = {"html": response}

    return jsonify({'html': 'test'})

### ROUTES END ###


app.layout = html.Div(children=[

    # render plotly graph
    dcc.Graph(
        id='crypto-graph',
        figure=fig
    )
])

# run the app
if __name__ == '__main__':
    app.run_server(debug=False)
