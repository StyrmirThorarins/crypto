# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

from urllib import response
from dash import Dash, html, dcc
from flask import jsonify, request, render_template
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

app.layout = html.Div(children=[])


# fetch data
def fetch_data(crypto_acronyms):
    df = pd.DataFrame()

    for acronym in crypto_acronyms:
        data = requests.get('https://min-api.cryptocompare.com/data/v2/histoday', params={
            'fsym': acronym, 'tsym': 'USD', 'limit': '10', 'api_key': os.getenv("CRYPTOCOMPARE_API_KEY")})
        df = pd.DataFrame(data.json()['Data']['Data'])

    return px.line(df, x='time', y="open")


# create graph html
def create_graph(crypto_acronyms):

    fig = px.line()
    fig = fetch_data(crypto_acronyms)

    app.layout = html.Div(children=[

        # render plotly graph
        dcc.Graph(
            id='crypto-graph',
            figure=fig
        )
    ])

    return app.layout


### ROUTES START ###

# http://127.0.0.1:8050/get_graph?crypto_list=ETH
@server.route('/get_graph')
def route_get_graph():
    crypto_list = request.args.get('crypto_list')
    logging.debug('route_get_graph route', crypto_list)

    aCryptoList = crypto_list.split(',')
    layout = create_graph(aCryptoList)

    logging.debug('route_get_graph route', layout)

    return '<h1>get_graph</h1>'
    # return layout


@server.route('/app/')
def route_app():
    logging.debug('route_app')
    fig = getFig()
    layout = getLayout(fig)

    return '<h1>app</h1>'
    # return layout

@server.route('/')
def route1():
    return jsonify({'message': 'this is the first route'})


# https://www.educba.com/flask-url-parameters/
# http://127.0.0.1:8050/test&crypto_list=ETH
@server.route('/test')
def route2():
    crypto_list = request.args.get('crypto_list')
    # return jsonify({'message': 'this is the second route'.format(crypto_list)})
    return '''<h1>The source value is: {}</h1>'''.format(crypto_list)


# https://www.educba.com/flask-url-parameters/
# http://127.0.0.1:8050/test/crypto_list=ETH
@server.route('/test2/<crypto_list>')
def route3(crypto_list):
    return 'The value is: ' + crypto_list


# set up app API to return graph html
@server.route('/plotlygraph')
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


# set up plotly graph, https://plotly.com/python/px-arguments/
# https://community.plotly.com/t/announcing-plotly-py-4-8-plotly-express-support-for-wide-and-mixed-form-data-plus-a-pandas-backend/40048/10
#fig = px.line()
#fig = fetch_data(['BTC'])

#crypto_list = request.args.get('crypto_list')
#fig = fetch_data(crypto_list.split(','))

def getFig():
    fig = px.line()
    fig = fetch_data(['BTC'])

    return fig


def getLayout(fig):
    layout = html.Div(children=[
        # render plotly graph
        dcc.Graph(
            id='crypto-graph',
            figure=fig
        )
    ])
    return layout


fig = getFig()
app.layout = getLayout(fig)

# run the app
if __name__ == '__main__':
    app.run_server(debug=True)
    print('args ', request.args)
